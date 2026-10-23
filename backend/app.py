# Точка входа: создаёт Flask-приложение и подключает все маршруты.
# Запуск: python app.py

from flask import Flask, jsonify
from flask_cors import CORS

import auth
import cart
import db
import products

app = Flask(__name__)
app.json.ensure_ascii = False  # русские буквы в ответах без \u-кодов

# Разрешаем запросы с фронтенда (веб на другом порту и мобильное приложение)
CORS(app)

app.teardown_appcontext(db.close_db)
app.register_blueprint(auth.bp)
app.register_blueprint(products.bp)
app.register_blueprint(cart.bp)


@app.get("/api/health")
def health():
    """Проверка, что сервер запущен."""
    return jsonify(status="ok")


@app.errorhandler(404)
def not_found(error):
    return jsonify(message="Не найдено"), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify(message="Внутренняя ошибка сервера"), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
