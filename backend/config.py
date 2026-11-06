import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://aura:aura@localhost:5432/aura")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
DATABASE_HOST = os.getenv("DATABASE_HOST")
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET = "aura-images"
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "true"
MINIO_PUBLIC_URL = os.getenv("MINIO_PUBLIC_URL", "http://localhost:9000").rstrip("/")
UPLOAD_ADMIN_TOKEN = os.getenv("UPLOAD_ADMIN_TOKEN", "")

# Сколько живёт токен входа: 7 дней в секундах
TOKEN_LIFETIME = 60 * 60 * 24 * 7
