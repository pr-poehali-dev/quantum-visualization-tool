import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2
import psycopg2.extras

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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


def _hash(password):
    return hashlib.sha256(password.encode()).hexdigest()


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
    '''Регистрация, вход, профиль пользователя интернет-магазина столов'''
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
        if method == 'POST' and action == 'register':
            body = json.loads(event.get('body') or '{}')
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            name = (body.get('name') or '').strip()
            if not email or not password:
                return _resp(400, {'error': 'Укажите email и пароль'})
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return _resp(409, {'error': 'Пользователь с таким email уже существует'})
            cur.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id, email, name, phone, address, is_admin",
                (email, _hash(password), name),
            )
            user = cur.fetchone()
            new_token = secrets.token_hex(32)
            expires = datetime.utcnow() + timedelta(days=30)
            cur.execute(
                "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user['id'], new_token, expires),
            )
            return _resp(200, {'token': new_token, 'user': user})

        if method == 'POST' and action == 'login':
            body = json.loads(event.get('body') or '{}')
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            cur.execute(
                "SELECT id, email, name, phone, address, is_admin FROM users WHERE email = %s AND password_hash = %s",
                (email, _hash(password)),
            )
            user = cur.fetchone()
            if not user:
                return _resp(401, {'error': 'Неверный email или пароль'})
            new_token = secrets.token_hex(32)
            expires = datetime.utcnow() + timedelta(days=30)
            cur.execute(
                "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user['id'], new_token, expires),
            )
            return _resp(200, {'token': new_token, 'user': user})

        if method == 'GET' and action == 'me':
            user = _user_by_token(cur, token)
            if not user:
                return _resp(401, {'error': 'Не авторизован'})
            return _resp(200, {'user': user})

        if method == 'PUT' and action == 'profile':
            user = _user_by_token(cur, token)
            if not user:
                return _resp(401, {'error': 'Не авторизован'})
            body = json.loads(event.get('body') or '{}')
            name = (body.get('name') or '').strip()
            phone = (body.get('phone') or '').strip()
            address = (body.get('address') or '').strip()
            cur.execute(
                "UPDATE users SET name = %s, phone = %s, address = %s WHERE id = %s "
                "RETURNING id, email, name, phone, address, is_admin",
                (name, phone, address, user['id']),
            )
            return _resp(200, {'user': cur.fetchone()})

        if method == 'POST' and action == 'logout':
            if token:
                cur.execute("DELETE FROM sessions WHERE token = %s", (token,))
            return _resp(200, {'ok': True})

        return _resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()
