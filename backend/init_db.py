# Создаёт таблицы, заполняет каталог и добавляет демо-аккаунт.
# Запуск: python init_db.py
# ВНИМАНИЕ: все данные в базе удаляются и создаются заново.

from pathlib import Path

import psycopg2
from werkzeug.security import generate_password_hash

import config

FOLDER = Path(__file__).parent

# Тот же демо-аккаунт, что и в моках фронтенда (web/src/data/demoUser.js)
DEMO_NAME = "Демо"
DEMO_EMAIL = "demo@aura.test"
DEMO_PASSWORD = "demo12345"


def main():
    connection = psycopg2.connect(config.DATABASE_URL)
    # with connection — изменения сохранятся только если всё прошло без ошибок
    with connection, connection.cursor() as cursor:
        cursor.execute((FOLDER / "schema.sql").read_text(encoding="utf-8"))
        cursor.execute((FOLDER / "seed.sql").read_text(encoding="utf-8"))
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (DEMO_NAME, DEMO_EMAIL, generate_password_hash(DEMO_PASSWORD)),
        )
    connection.close()
    print("База данных создана и заполнена")


if __name__ == "__main__":
    main()
