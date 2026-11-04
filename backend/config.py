import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://aura:aura@localhost:5432/aura")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
MINIO_ENDPOINT = "localhost:9000"
MINIO_ACCESS_KEY = "minioadmin"  # (или тот логин, что ты задал в -e MINIO_ROOT_USER)
MINIO_SECRET_KEY = "minioadmin"  # (или тот пароль, что ты задал в -e MINIO_ROOT_PASSWORD)
MINIO_BUCKET = "aura-images"

# Сколько живёт токен входа: 7 дней в секундах
TOKEN_LIFETIME = 60 * 60 * 24 * 7
