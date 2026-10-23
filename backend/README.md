# Бэкенд AURA

Flask + PostgreSQL + Redis. PostgreSQL хранит пользователей и товары, Redis — токены входа.

## Файлы

| Файл | Что внутри |
|---|---|
| `app.py` | Точка входа: создаёт приложение и подключает маршруты |
| `auth.py` | Регистрация, вход, выход, проверка токена (`login_required`) |
| `products.py` | Каталог: список с фильтром и поиском, один товар |
| `db.py` | Подключение к PostgreSQL и Redis, функции для запросов |
| `config.py` | Настройки из `.env` |
| `schema.sql` | Создание таблиц |
| `seed.sql` | Тестовые товары |
| `init_db.py` | Создаёт таблицы, заполняет каталог, добавляет демо-аккаунт |
| `docker-compose.yml` | Redis в Docker |

## Запуск

1. Подготовить базы:
   - PostgreSQL установлен в системе. Один раз создать пользователя и базу
     (спросит пароль пользователя `postgres`):

     ```
     psql -U postgres -c "CREATE USER aura WITH PASSWORD 'aura';" -c "CREATE DATABASE aura OWNER aura;"
     ```

   - Redis запускается в Docker (нужен запущенный Docker Desktop):

     ```
     docker compose up -d
     ```

2. Создать виртуальное окружение и установить зависимости:

   ```
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Создать таблицы и тестовые данные (повторный запуск удаляет все данные):

   ```
   python init_db.py
   ```

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
| GET | `/health` | — | `{ status: "ok" }` |

Кроме `register`, `login` и `health`, все запросы требуют заголовок
`Authorization: Bearer <token>`.
