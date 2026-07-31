import base64
import json
import os
import uuid
import boto3
import psycopg2
import psycopg2.extras

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}


def _resp(status, body):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps(body, default=str),
    }


def _db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _admin_by_token(cur, token):
    if not token:
        return None
    cur.execute(
        "SELECT u.id, u.is_admin FROM sessions s JOIN users u ON u.id = s.user_id "
        "WHERE s.token = %s AND s.expires_at > NOW()",
        (token,),
    )
    u = cur.fetchone()
    if u and u['is_admin']:
        return u
    return None


def handler(event, context):
    '''Админ-панель: заказы, пользователи, товары и статистика магазина'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')

    conn = _db()
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        admin = _admin_by_token(cur, token)
        if not admin:
            return _resp(403, {'error': 'Доступ только для администратора'})

        # ---- Статистика ----
        if method == 'GET' and action == 'stats':
            cur.execute("SELECT COUNT(*) AS c FROM orders")
            orders_count = cur.fetchone()['c']
            cur.execute("SELECT COALESCE(SUM(total), 0) AS s FROM orders WHERE status != 'canceled'")
            revenue = cur.fetchone()['s']
            cur.execute("SELECT COUNT(*) AS c FROM users WHERE is_admin = FALSE")
            users_count = cur.fetchone()['c']
            cur.execute("SELECT COUNT(*) AS c FROM orders WHERE status = 'new'")
            new_orders = cur.fetchone()['c']
            cur.execute("SELECT status, COUNT(*) AS c FROM orders GROUP BY status")
            by_status = {r['status']: r['c'] for r in cur.fetchall()}
            return _resp(200, {
                'orders_count': orders_count,
                'revenue': revenue,
                'users_count': users_count,
                'new_orders': new_orders,
                'by_status': by_status,
            })

        # ---- Заказы ----
        if method == 'GET' and action == 'orders':
            cur.execute(
                "SELECT o.id, o.total, o.status, o.comment, o.created_at, "
                "o.customer_name, o.customer_phone, o.customer_address, u.email "
                "FROM orders o LEFT JOIN users u ON u.id = o.user_id ORDER BY o.id DESC"
            )
            orders = cur.fetchall()
            for o in orders:
                cur.execute("SELECT title, price, quantity, image_url, config FROM order_items WHERE order_id = %s", (o['id'],))
                o['items'] = cur.fetchall()
            return _resp(200, {'orders': orders})

        if method == 'PUT' and action == 'order_status':
            body = json.loads(event.get('body') or '{}')
            cur.execute("UPDATE orders SET status = %s WHERE id = %s", (body.get('status'), int(body.get('id'))))
            return _resp(200, {'ok': True})

        # ---- Пользователи ----
        if method == 'GET' and action == 'users':
            cur.execute(
                "SELECT u.id, u.email, u.name, u.phone, u.address, u.created_at, "
                "(SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS orders_count "
                "FROM users u WHERE u.is_admin = FALSE ORDER BY u.id DESC"
            )
            return _resp(200, {'users': cur.fetchall()})

        # ---- Товары ----
        if method == 'GET' and action == 'products':
            cur.execute("SELECT id, name, category, description, price, image_url, is_active FROM products ORDER BY id")
            return _resp(200, {'products': cur.fetchall()})

        if method == 'POST' and action == 'products':
            body = json.loads(event.get('body') or '{}')
            cur.execute(
                "INSERT INTO products (name, category, description, price, image_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (body.get('name'), body.get('category'), body.get('description'), int(body.get('price') or 0), body.get('image_url')),
            )
            return _resp(200, {'id': cur.fetchone()['id']})

        if method == 'PUT' and action == 'products':
            body = json.loads(event.get('body') or '{}')
            cur.execute(
                "UPDATE products SET name = %s, category = %s, description = %s, price = %s, image_url = %s, is_active = %s WHERE id = %s",
                (
                    body.get('name'), body.get('category'), body.get('description'),
                    int(body.get('price') or 0), body.get('image_url'),
                    bool(body.get('is_active', True)), int(body.get('id')),
                ),
            )
            return _resp(200, {'ok': True})

        if method == 'DELETE' and action == 'products':
            pid = int(params.get('id'))
            cur.execute("UPDATE products SET is_active = FALSE WHERE id = %s", (pid,))
            return _resp(200, {'ok': True})

        # ---- Тексты сайта ----
        if method == 'GET' and action == 'content':
            cur.execute("SELECT key, value FROM site_content")
            return _resp(200, {'content': {r['key']: r['value'] for r in cur.fetchall()}})

        if method == 'PUT' and action == 'content':
            body = json.loads(event.get('body') or '{}')
            items = body.get('items') or {}
            for key, value in items.items():
                cur.execute(
                    "INSERT INTO site_content (key, value, updated_at) VALUES (%s, %s, NOW()) "
                    "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                    (key, value),
                )
            return _resp(200, {'ok': True})

        # ---- Фото товаров (коллекция) ----
        if method == 'GET' and action == 'product_images':
            pid = int(params.get('product_id'))
            cur.execute(
                "SELECT id, image_url, sort_order FROM product_images WHERE product_id = %s ORDER BY sort_order, id",
                (pid,),
            )
            return _resp(200, {'images': cur.fetchall()})

        if method == 'POST' and action == 'product_images':
            body = json.loads(event.get('body') or '{}')
            cur.execute(
                "INSERT INTO product_images (product_id, image_url, sort_order) VALUES (%s, %s, %s) RETURNING id",
                (int(body.get('product_id')), body.get('image_url'), int(body.get('sort_order') or 0)),
            )
            return _resp(200, {'id': cur.fetchone()['id']})

        if method == 'DELETE' and action == 'product_images':
            img_id = int(params.get('id'))
            cur.execute("DELETE FROM product_images WHERE id = %s", (img_id,))
            return _resp(200, {'ok': True})

        # ---- Загрузка изображения в S3 ----
        if method == 'POST' and action == 'upload_image':
            body = json.loads(event.get('body') or '{}')
            file_b64 = body.get('file')
            content_type = body.get('content_type', 'image/jpeg')
            ext = content_type.split('/')[-1] if '/' in content_type else 'jpg'
            if not file_b64:
                return _resp(400, {'error': 'Файл не передан'})
            data = base64.b64decode(file_b64)
            key = f"products/{uuid.uuid4()}.{ext}"
            s3 = boto3.client(
                's3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
            )
            s3.put_object(Bucket='files', Key=key, Body=data, ContentType=content_type)
            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
            return _resp(200, {'url': cdn_url})

        return _resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()