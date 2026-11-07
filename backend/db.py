# Подключение к PostgreSQL и Redis и вспомогательные функции для запросов.

import psycopg2
import redis
from flask import g
from psycopg2.extras import RealDictCursor

import config


redis_client = redis.Redis.from_url(config.REDIS_URL, decode_responses=True)


def get_db():
    if "db" not in g:
        # RealDictCursor возвращает строки как словари: {"id": 1, "name": ...}
        options = {"host": config.DATABASE_HOST} if config.DATABASE_HOST else {}
        g.db = psycopg2.connect(config.DATABASE_URL, cursor_factory=RealDictCursor, **options)
    return g.db


def close_db(error=None):
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


def execute(sql, params=()):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute(sql, params)
        count = cursor.rowcount
    db.commit()
    return count


def insert(sql, params=()):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute(sql, params)
        row = cursor.fetchone()
    db.commit()
    return row
