from flask import Flask, jsonify, request
from flask_cors import CORS

import auth
import cart
import db
import products
import os
import uuid
from minio import Minio

app = Flask(__name__)
app.json.ensure_ascii = False  # русские буквы в ответах без \u-кодов

# Разрешаем запросы с фронтенда (веб на другом порту и мобильное приложение)
CORS(app)

app.teardown_appcontext(db.close_db)
app.register_blueprint(auth.bp)
app.register_blueprint(products.bp)
app.register_blueprint(cart.bp)

# --- НАСТРОЙКА MINIO ---
# (Убедись, что логин и пароль совпадают с теми, что ты задал в Docker)
minio_client = Minio(
    "localhost:9000",
    access_key="minioadmin",
    secret_key="minioadmin",
    secure=False
)
BUCKET_NAME = "aura-images"

@app.get("/api/health")
def health():
    """Проверка, что сервер запущен."""
    return jsonify(status="ok")

# --- НОВЫЙ МАРШРУТ ДЛЯ ЗАГРУЗКИ ---
@app.post("/api/upload")
def upload():
    if 'image' not in request.files:
        return jsonify(message="Файл не найден"), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify(message="Файл не выбран"), 400

    try:
        # Генерируем уникальное имя файла
        ext = file.filename.rsplit('.', 1)[-1].lower()
        object_name = f"{uuid.uuid4().hex}.{ext}"

        # Загружаем в MinIO
        minio_client.put_object(
            BUCKET_NAME,
            object_name,
            file,
            length=-1,
            part_size=10*1024*1024,
            content_type=file.content_type
        )

        # Возвращаем ссылку для браузера
        image_url = f"http://localhost:9000/{BUCKET_NAME}/{object_name}"
        return jsonify(url=image_url), 201

    except Exception as e:
        print(f"Ошибка MinIO: {e}") # Выведет ошибку в терминал, если что-то не так
        return jsonify(message=f"Ошибка загрузки: {str(e)}"), 500
# ---------------------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify(message="Не найдено"), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify(message="Внутренняя ошибка сервера"), 500

@app.get("/api/check")
def check():
    return jsonify(message="Я вижу этот код!")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)