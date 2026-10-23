# Настройки приложения. Значения берутся из файла .env,
# а если его нет — используются значения по умолчанию.

import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://aura:aura@localhost:5432/aura")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Сколько живёт токен входа: 7 дней в секундах
TOKEN_LIFETIME = 60 * 60 * 24 * 7
