import json
import os
import smtplib
import urllib.request
import urllib.parse
from email.mime.text import MIMEText
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


def _order_notification_text(order_id, total, name, phone, address, comment, items, utm_source):
    lines = [
        f"Новый заказ №{order_id}",
        f"Сумма: {total} ₽",
        f"Имя: {name or '-'}",
        f"Телефон: {phone or '-'}",
    ]
    if address:
        lines.append(f"Адрес: {address}")
    if comment:
        lines.append(f"Комментарий: {comment}")
    if utm_source:
        lines.append(f"Источник рекламы: {utm_source}")
    lines.append("")
    lines.append("Состав заказа:")
    for i in items:
        title = i.get('title', 'Товар') if isinstance(i, dict) else i['title']
        qty = i.get('quantity') or 1 if isinstance(i, dict) else i['quantity']
        price = i.get('price') if isinstance(i, dict) else i['price']
        lines.append(f"— {title} × {qty} = {int(price) * int(qty)} ₽")
    return "\n".join(lines)


def _notify_email(order_id, text):
    login = os.environ.get('SMTP_LOGIN')
    password = os.environ.get('SMTP_PASSWORD')
    if not login or not password:
        return
    msg = MIMEText(text, _charset='utf-8')
    msg['Subject'] = f"Новый заказ №{order_id} — Русский Стол"
    msg['From'] = login
    msg['To'] = login
    try:
        with smtplib.SMTP_SSL('smtp.mail.ru', 465, timeout=5) as server:
            server.login(login, password)
            server.sendmail(login, [login], msg.as_string())
    except Exception as e:
        print(f"[order_notify_email_error] order_id={order_id} error={type(e).__name__}: {e}")


def _notify_telegram(order_id, text):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat_id:
        return
    # api.telegram.org может быть недоступен напрямую из облака — используем прокси, если задан
    api_base = os.environ.get('TELEGRAM_API_BASE', 'https://api.telegram.org').rstrip('/')
    try:
        data = urllib.parse.urlencode({'chat_id': chat_id, 'text': text}).encode()
        req = urllib.request.Request(f"{api_base}/bot{token}/sendMessage", data=data)
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        print(f"[order_notify_telegram_error] order_id={order_id} error={type(e).__name__}: {e}")


def _notify_new_order(order_id, total, name, phone, address, comment, items, utm_source):
    text = _order_notification_text(order_id, total, name, phone, address, comment, items, utm_source)
    _notify_email(order_id, text)
    _notify_telegram(order_id, text)


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
            products = cur.fetchall()
            cur.execute(
                "SELECT product_id, image_url FROM product_images WHERE product_id IN "
                "(SELECT id FROM products WHERE is_active = TRUE) ORDER BY sort_order, id"
            )
            images_by_product = {}
            for row in cur.fetchall():
                images_by_product.setdefault(row['product_id'], []).append(row['image_url'])
            for p in products:
                p['images'] = images_by_product.get(p['id'], [])
            return _resp(200, {'products': products})

        # Публичные тексты сайта
        if method == 'GET' and action == 'content':
            cur.execute("SELECT key, value FROM site_content")
            return _resp(200, {'content': {r['key']: r['value'] for r in cur.fetchall()}})

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
                "INSERT INTO orders (user_id, customer_name, customer_phone, customer_address, total, comment, "
                "utm_source, utm_medium, utm_campaign, utm_content, utm_term) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id, created_at",
                (
                    uid,
                    body.get('name') or user.get('name'),
                    body.get('phone') or user.get('phone'),
                    body.get('address') or user.get('address'),
                    total,
                    body.get('comment'),
                    body.get('utm_source'),
                    body.get('utm_medium'),
                    body.get('utm_campaign'),
                    body.get('utm_content'),
                    body.get('utm_term'),
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
            _notify_new_order(
                oid, total,
                body.get('name') or user.get('name'),
                body.get('phone') or user.get('phone'),
                body.get('address') or user.get('address'),
                body.get('comment'),
                items,
                body.get('utm_source'),
            )
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