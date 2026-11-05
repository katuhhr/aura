from flask import Blueprint, g, jsonify, request

from auth import login_required
from db import execute, fetch_all, fetch_one

bp = Blueprint("cart", __name__, url_prefix="/api/cart")


def get_cart():
    return fetch_all(
        """
        SELECT c.id,
               c.variant_id         AS "variantId",
               p.id                 AS "productId",
               p.name,
               v.size,
               v.color,
               p.price,
               p.images[1]          AS image,
               c.quantity
        FROM cart_items c
        JOIN product_variants v ON v.id = c.variant_id
        JOIN products p ON p.id = v.product_id
        WHERE c.user_id = %s
        ORDER BY c.id
        """,
        (g.user_id,),
    )


def read_quantity(data, default=None):
    """Достаёт количество из запроса. Возвращает None, если оно неправильное."""
    quantity = data.get("quantity", default)
    if type(quantity) is not int or quantity < 1:
        return None
    return quantity


@bp.get("")
@login_required
def show_cart():
    return jsonify(get_cart())


# В cart.py
@bp.post("")
@login_required
def add_to_cart():
    data = request.get_json(silent=True) or {}
    variant_id = data.get("variantId") # <-- Изменилось!
    quantity = read_quantity(data, default=1)

    if not variant_id:
        return jsonify(message="Не передан вариант товара"), 400

    # Проверяем, есть ли такой вариант
    variant = fetch_one("SELECT id FROM product_variants WHERE id = %s", (variant_id,))
    if not variant:
        return jsonify(message="Вариант товара не найден"), 404

    # Вставляем в корзину
    execute(
        """
        INSERT INTO cart_items (user_id, variant_id, quantity)
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id, variant_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        """,
        (g.user_id, variant_id, quantity),
    )
    return jsonify(get_cart()), 201

@bp.patch("/<int:item_id>")
@login_required
def change_quantity(item_id):
    quantity = read_quantity(request.get_json(silent=True) or {})
    if quantity is None:
        return jsonify(message="Количество должно быть целым числом больше нуля"), 400

    updated = execute(
        "UPDATE cart_items SET quantity = %s WHERE id = %s AND user_id = %s",
        (quantity, item_id, g.user_id),
    )
    if updated == 0:
        return jsonify(message="Позиция корзины не найдена"), 404
    return jsonify(get_cart())


@bp.delete("/<int:item_id>")
@login_required
def remove_from_cart(item_id):
    deleted = execute("DELETE FROM cart_items WHERE id = %s AND user_id = %s", (item_id, g.user_id))
    if deleted == 0:
        return jsonify(message="Позиция корзины не найдена"), 404
    return jsonify(get_cart())
