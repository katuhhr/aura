# Регистрация, вход, выход и проверка токена.

import secrets
from functools import wraps

from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

import config
from db import fetch_one, insert, redis_client

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def create_token(user_id):
    """Создаёт случайный токен и запоминает в Redis, какому пользователю он принадлежит."""
    token = secrets.token_hex(32)
    redis_client.setex(f"token:{token}", config.TOKEN_LIFETIME, user_id)
    return token


def get_token():
    """Достаёт токен из заголовка Authorization: Bearer <токен>."""
    header = request.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header[len("Bearer "):]
    return None


def login_required(view):
    """Декоратор: пускает к обработчику только пользователей с действующим токеном."""
    @wraps(view)
    def wrapper(*args, **kwargs):
        token = get_token()
        user_id = redis_client.get(f"token:{token}") if token else None
        if user_id is None:
            return jsonify(message="Требуется авторизация"), 401
        g.user_id = int(user_id)
        return view(*args, **kwargs)

    return wrapper


@bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify(message="Заполните все поля"), 400
    if len(password) < 6:
        return jsonify(message="Пароль должен быть не короче 6 символов"), 400
    if fetch_one("SELECT id FROM users WHERE email = %s", (email,)):
        return jsonify(message="Пользователь с такой почтой уже зарегистрирован"), 409

    # В базе хранится не сам пароль, а его хеш
    user = insert(
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) "
        "RETURNING id, name, email",
        (name, email, generate_password_hash(password)),
    )
    return jsonify(token=create_token(user["id"]), user=user), 201


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = fetch_one("SELECT id, name, email, password_hash FROM users WHERE email = %s", (email,))
    if user is None or not check_password_hash(user["password_hash"], password):
        return jsonify(message="Неверная почта или пароль"), 401

    del user["password_hash"]
    return jsonify(token=create_token(user["id"]), user=user)


@bp.get("/me")
@login_required
def me():
    user = fetch_one("SELECT id, name, email FROM users WHERE id = %s", (g.user_id,))
    if user is None:
        return jsonify(message="Пользователь не найден"), 401
    return jsonify(user)


@bp.post("/logout")
@login_required
def logout():
    redis_client.delete(f"token:{get_token()}")
    return jsonify(message="Вы вышли из аккаунта")
