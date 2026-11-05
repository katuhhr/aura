import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://aura:aura@localhost:5432/aura")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
MINIO_ENDPOINT = "localhost:9000"
MINIO_ACCESS_KEY = "minioadmin" 
MINIO_SECRET_KEY = "minioadmin"  
MINIO_BUCKET = "aura-images"
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "true"
# Сколько живёт токен входа: 7 дней в секундах
TOKEN_LIFETIME = 60 * 60 * 24 * 7
