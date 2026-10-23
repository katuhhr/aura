# Подключение к PostgreSQL и Redis и вспомогательные функции для запросов.

import psycopg2
import redis
from flask import g
from psycopg2.extras import RealDictCursor

import config

# Redis хранит токены входа: ключ "token:<токен>" -> id пользователя
redis_client = redis.Redis.from_url(config.REDIS_URL, decode_responses=True)


def get_db():
    """Одно подключение к базе на один запрос."""
    if "db" not in g:
        # RealDictCursor возвращает строки как словари: {"id": 1, "name": ...}
        g.db = psycopg2.connect(config.DATABASE_URL, cursor_factory=RealDictCursor)
    return g.db


def close_db(error=None):
    """Закрывает подключение после завершения запроса."""
    db = g.pop("db", None)
    if db is not None:
        db.close()


def fetch_all(sql, params=()):
    with get_db().cursor() as cursor:
        cursor.execute(sql, params)
        return cursor.fetchall()


def fetch_one(sql, params=()):
    with get_db().cursor() as cursor:
        cursor.execute(sql, params)
        return cursor.fetchone()


def insert(sql, params=()):
    """Выполняет INSERT ... RETURNING, сохраняет изменения и возвращает новую строку."""
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute(sql, params)
        row = cursor.fetchone()
    db.commit()
    return row
