from flask import Blueprint, jsonify, request
from auth import login_required
from db import fetch_all, fetch_one

bp = Blueprint("products", __name__, url_prefix="/api/products")

# Правильный список полей без 'sizes' и 'colors'
FIELDS = "id, name, category, price, description, images"

@bp.get("")
@login_required
def list_products():
    category = request.args.get("category", "").strip()
    search = request.args.get("search", "").strip()

    sql = f"SELECT {FIELDS} FROM products WHERE TRUE"
    params = []
    
    if category:
        sql += " AND category = %s"
        params.append(category)
    if search:
        sql += " AND name ILIKE %s"
        params.append(f"%{search}%")
    sql += " ORDER BY id"

    products_list = fetch_all(sql, params)
    
    # Для каждого товара подтягиваем его варианты (размеры и цвета) из product_variants
    for product in products_list:
        product['variants'] = fetch_all(
            "SELECT id, size, color FROM product_variants WHERE product_id = %s", 
            (product['id'],)
        )

    return jsonify(products_list)

@bp.get("/<int:product_id>")
@login_required
def get_product(product_id):
    product = fetch_one(f"SELECT {FIELDS} FROM products WHERE id = %s", (product_id,))
    if product is None:
        return jsonify(message="Товар не найден"), 404
    
    # Подтягиваем варианты для одного товара
    product['variants'] = fetch_all(
        "SELECT id, size, color FROM product_variants WHERE product_id = %s", 
        (product_id,)
    )
    
    return jsonify(product)