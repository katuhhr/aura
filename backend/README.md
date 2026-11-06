# Бэкенд AURA

Flask + PostgreSQL + Redis. PostgreSQL хранит пользователей, товары и корзины, Redis — токены входа.

## Файлы

| Файл | Что внутри |
|---|---|
| `app.py` | Точка входа: создаёт приложение и подключает маршруты |
| `auth.py` | Регистрация, вход, выход, проверка токена (`login_required`) |
| `products.py` | Каталог: список с фильтром и поиском, один товар |
| `cart.py` | Корзина пользователя: показать, добавить, изменить количество, удалить |
| `db.py` | Подключение к PostgreSQL и Redis, функции для запросов |
| `config.py` | Настройки из `.env` |
| `docker-compose.yml` | Веб, Flask, Redis и MinIO в Docker |

## Запуск через Docker Compose

В папке backend настройте .env с доступом к существующей PostgreSQL.
На Windows с Docker Desktop Flask подключается к PostgreSQL через host.docker.internal.
Оставьте PostgreSQL запущенной. Compose запускает MinIO с данными из C:/minio/data и лицензией
из C:/minio/minio.license. Пути задаются через AURA_MINIO_DATA_DIR и AURA_MINIO_LICENSE_FILE.
Перед первым запуском остановите отдельный MinIO, если он использует ту же папку или порты 9000/9001.
Консоль MinIO доступна на http://localhost:9001.

    docker compose up -d --build

Веб доступен на http://localhost:8080, Flask на http://localhost:5000.
Если Flask уже запущен вручную, освободите порт 5000 или задайте AURA_BACKEND_PORT в backend/.env.
Веб обращается к Flask через Nginx по /api.

## Ручной запуск

1. Подготовить базы:
   - PostgreSQL установлен в системе. Один раз создать пользователя и базу
     (спросит пароль пользователя `postgres`):

     ```
     psql -U postgres -c "CREATE USER aura WITH PASSWORD 'aura';" -c "CREATE DATABASE aura OWNER aura;"
     ```

   - Redis запускается в Docker (нужен запущенный Docker Desktop):

     ```
     docker compose up -d redis
     ```

2. Создать виртуальное окружение и установить зависимости:

   ```
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   copy .env.example .env
   ```

3. Таблицы и данные ведутся вручную в PostgreSQL (например, через pgAdmin).
   Серверу нужны четыре таблицы:

   | Таблица | Столбцы |
   |---|---|
   | `users` | `id`, `name`, `email` (уникальный), `password_hash`, `created_at` |
   | products | id, name, category, price, description, images (TEXT[]), color_images (JSONB: цвет → URL) |
   | product_variants | id, product_id → products, size, color |
   | cart_items | id, user_id → users, variant_id → product_variants, quantity |

4. Запустить сервер — он будет доступен на http://localhost:5000:

   ```
   python app.py
   ```

5. Подключить фронтенд: в папке `web` создать файл `.env` со строкой
   `VITE_API_URL=http://localhost:5000/api` и перезапустить `npm run dev`.

## API

Все адреса начинаются с `/api`. Ошибки приходят в виде `{ "message": "текст ошибки" }`.

| Метод | Адрес | Тело запроса | Ответ |
|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` | `{ token, user }` |
| POST | `/auth/login` | `{ email, password }` | `{ token, user }` |
| GET | `/auth/me` | — | `user` |
| POST | `/auth/logout` | — | `{ message }` |
| GET | `/products?category=&search=` | — | список товаров |
| GET | `/products/<id>` | — | товар |
| GET | `/cart` | — | корзина |
| POST | `/cart` | `{ variantId, quantity }` | корзина |
| PATCH | `/cart/<id>` | `{ quantity }` | корзина |
| DELETE | `/cart/<id>` | — | корзина |
| GET | `/health` | — | `{ status: "ok" }` |

Кроме `register`, `login` и `health`, все запросы требуют заголовок
`Authorization: Bearer <token>`.

Каталог и карточка возвращают массив variants с полями id, size и color.

Все запросы к корзине возвращают её целиком: `[{ id, productId, variantId, name, category, price, image, size, color, quantity }]`.
