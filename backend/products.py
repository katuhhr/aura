
from flask import Blueprint, jsonify, request

from auth import login_required
from db import fetch_all, fetch_one

bp = Blueprint("products", __name__, url_prefix="/api/products")

FIELDS = """
    id, name, category, price, description, COALESCE(images, '{}') AS images, COALESCE(to_jsonb(products) -> 'color_images', '{}'::jsonb) AS "colorImages",
    COALESCE((
        SELECT json_agg(json_build_object('id', v.id, 'size', v.size, 'color', v.color) ORDER BY v.id)
        FROM product_variants v WHERE v.product_id = products.id
    ), '[]'::json) AS variants
"""


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

    return jsonify(fetch_all(sql, params))


@bp.get("/<int:product_id>")
@login_required
def get_product(product_id):
    product = fetch_one(f"SELECT {FIELDS} FROM products WHERE id = %s", (product_id,))
    if product is None:
        return jsonify(message="Товар не найден"), 404
    return jsonify(product)
