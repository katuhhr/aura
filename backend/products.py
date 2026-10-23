# Каталог товаров: список с фильтрами и один товар.

from flask import Blueprint, jsonify, request

from auth import login_required
from db import fetch_all, fetch_one

bp = Blueprint("products", __name__, url_prefix="/api/products")

FIELDS = "id, name, category, price, description, sizes, colors, images"


@bp.get("")
@login_required
def list_products():
    # Пример запроса: /api/products?category=Women&search=платье
    category = request.args.get("category", "").strip()
    search = request.args.get("search", "").strip()

    sql = f"SELECT {FIELDS} FROM products WHERE TRUE"
    params = []
    if category:
        sql += " AND category = %s"
        params.append(category)
    if search:
        # ILIKE — поиск без учёта регистра, % — любые символы до и после
        sql += " AND name ILIKE %s"
        params.append(f"%{search}%")
    sql += " ORDER BY id"

    return jsonify(fetch_all(sql, params))


@bp.get("/<int:product_id>")
@login_required
def get_product(product_id):
    product = fetch_one(f"SELECT {FIELDS} FROM products WHERE id = %s", (product_id,))
    if product is None:
        return jsonify(message="Товар не найден"), 404
    return jsonify(product)
