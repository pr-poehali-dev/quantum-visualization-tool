import json
import os
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


def _user_by_token(cur, token):
    if not token:
        return None
    cur.execute(
        "SELECT u.id, u.email, u.name, u.phone, u.address, u.is_admin "
        "FROM sessions s JOIN users u ON u.id = s.user_id "
        "WHERE s.token = %s AND s.expires_at > NOW()",
        (token,),
    )
    return cur.fetchone()


def handler(event, context):
    '''Каталог товаров, корзина, избранное и заказы интернет-магазина'''
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
        # Публичный каталог
        if method == 'GET' and action == 'products':
            cur.execute("SELECT id, name, category, description, price, image_url FROM products WHERE is_active = TRUE ORDER BY id")
            return _resp(200, {'products': cur.fetchall()})

        # Дальше нужен пользователь
        user = _user_by_token(cur, token)
        if not user:
            return _resp(401, {'error': 'Не авторизован'})
        uid = user['id']

        # ---- Корзина ----
        if method == 'GET' and action == 'cart':
            cur.execute(
                "SELECT id, product_id, title, price, quantity, image_url, config FROM cart_items WHERE user_id = %s ORDER BY id",
                (uid,),
            )
            return _resp(200, {'items': cur.fetchall()})

        if method == 'POST' and action == 'cart':
            body = json.loads(event.get('body') or '{}')
            cur.execute(
                "INSERT INTO cart_items (user_id, product_id, title, price, quantity, image_url, config) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (
                    uid,
                    body.get('product_id'),
                    body.get('title', 'Товар'),
                    int(body.get('price') or 0),
                    int(body.get('quantity') or 1),
                    body.get('image_url'),
                    json.dumps(body.get('config')) if body.get('config') is not None else None,
                ),
            )
            return _resp(200, {'id': cur.fetchone()['id']})

        if method == 'PUT' and action == 'cart':
            body = json.loads(event.get('body') or '{}')
            cur.execute(
                "UPDATE cart_items SET quantity = %s WHERE id = %s AND user_id = %s",
                (int(body.get('quantity') or 1), int(body.get('id')), uid),
            )
            return _resp(200, {'ok': True})

        if method == 'DELETE' and action == 'cart':
            item_id = params.get('id')
            if item_id == 'all':
                cur.execute("DELETE FROM cart_items WHERE user_id = %s", (uid,))
            else:
                cur.execute("DELETE FROM cart_items WHERE id = %s AND user_id = %s", (int(item_id), uid))
            return _resp(200, {'ok': True})

        # ---- Избранное ----
        if method == 'GET' and action == 'favorites':
            cur.execute(
                "SELECT p.id, p.name, p.category, p.description, p.price, p.image_url "
                "FROM favorites f JOIN products p ON p.id = f.product_id "
                "WHERE f.user_id = %s ORDER BY f.id DESC",
                (uid,),
            )
            return _resp(200, {'products': cur.fetchall()})

        if method == 'POST' and action == 'favorites':
            body = json.loads(event.get('body') or '{}')
            pid = int(body.get('product_id'))
            cur.execute(
                "INSERT INTO favorites (user_id, product_id) VALUES (%s, %s) ON CONFLICT (user_id, product_id) DO NOTHING",
                (uid, pid),
            )
            return _resp(200, {'ok': True})

        if method == 'DELETE' and action == 'favorites':
            pid = int(params.get('product_id'))
            cur.execute("DELETE FROM favorites WHERE user_id = %s AND product_id = %s", (uid, pid))
            return _resp(200, {'ok': True})

        # ---- Заказы ----
        if method == 'POST' and action == 'order':
            body = json.loads(event.get('body') or '{}')
            items = body.get('items') or []
            if not items:
                cur.execute("SELECT product_id, title, price, quantity, image_url, config FROM cart_items WHERE user_id = %s", (uid,))
                items = cur.fetchall()
            if not items:
                return _resp(400, {'error': 'Корзина пуста'})
            total = sum(int(i['price']) * int(i.get('quantity') or 1) for i in items)
            cur.execute(
                "INSERT INTO orders (user_id, customer_name, customer_phone, customer_address, total, comment) "
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, created_at",
                (
                    uid,
                    body.get('name') or user.get('name'),
                    body.get('phone') or user.get('phone'),
                    body.get('address') or user.get('address'),
                    total,
                    body.get('comment'),
                ),
            )
            order = cur.fetchone()
            oid = order['id']
            for i in items:
                cfg = i.get('config')
                if cfg is not None and not isinstance(cfg, str):
                    cfg = json.dumps(cfg)
                cur.execute(
                    "INSERT INTO order_items (order_id, title, price, quantity, image_url, config) VALUES (%s, %s, %s, %s, %s, %s)",
                    (oid, i.get('title', 'Товар'), int(i['price']), int(i.get('quantity') or 1), i.get('image_url'), cfg),
                )
            cur.execute("DELETE FROM cart_items WHERE user_id = %s", (uid,))
            return _resp(200, {'order_id': oid, 'total': total})

        if method == 'GET' and action == 'orders':
            cur.execute(
                "SELECT id, total, status, comment, created_at FROM orders WHERE user_id = %s ORDER BY id DESC",
                (uid,),
            )
            orders = cur.fetchall()
            for o in orders:
                cur.execute("SELECT title, price, quantity, image_url, config FROM order_items WHERE order_id = %s", (o['id'],))
                o['items'] = cur.fetchall()
            return _resp(200, {'orders': orders})

        return _resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()
