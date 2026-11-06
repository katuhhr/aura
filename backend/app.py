from flask import Flask, jsonify
from flask_cors import CORS

import auth
import cart
import db
import products
import uploads

app = Flask(__name__)
app.json.ensure_ascii = False

CORS(app)

app.teardown_appcontext(db.close_db)

# Подключаем все blueprint'ы
app.register_blueprint(auth.bp)
app.register_blueprint(products.bp)
app.register_blueprint(cart.bp)
app.register_blueprint(uploads.bp)

@app.get("/api/health")
def health():
    return jsonify(status="ok")

@app.errorhandler(404)
def not_found(error):
    return jsonify(message="Не найдено"), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify(message="Внутренняя ошибка сервера"), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)