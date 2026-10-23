# Корзина пользователя. Каждый запрос в ответ возвращает всю корзину целиком,
# чтобы фронтенду было проще: он просто заменяет свой список на полученный.

from flask import Blueprint, g, jsonify, request

from auth import login_required
from db import execute, fetch_all, fetch_one

bp = Blueprint("cart", __name__, url_prefix="/api/cart")


def get_cart():
    """Позиции корзины текущего пользователя вместе с данными товара."""
    return fetch_all(
        """
        SELECT c.id,
               c.product_id         AS "productId",
               p.name,
               p.category,
               p.price,
               p.images[1]          AS image,  -- первое фото товара (в SQL массивы с 1)
               NULLIF(c.size, '')   AS size,   -- пустую строку отдаём как null
               NULLIF(c.color, '')  AS color,
               c.quantity
        FROM cart_items c
        JOIN products p ON p.id = c.product_id
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


@bp.post("")
@login_required
def add_to_cart():
    # Тело запроса: { "productId": 7, "size": "38", "color": "Чёрный", "quantity": 1 }
    data = request.get_json(silent=True) or {}
    product_id = data.get("productId")
    size = data.get("size") or ""
    color = data.get("color") or ""
    quantity = read_quantity(data, default=1)

    if quantity is None:
        return jsonify(message="Количество должно быть целым числом больше нуля"), 400
    if not isinstance(product_id, int) or not fetch_one("SELECT id FROM products WHERE id = %s", (product_id,)):
        return jsonify(message="Товар не найден"), 404

    # Если такая позиция уже есть — увеличиваем количество, иначе добавляем новую строку
    execute(
        """
        INSERT INTO cart_items (user_id, product_id, size, color, quantity)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (user_id, product_id, size, color)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        """,
        (g.user_id, product_id, size, color, quantity),
    )
    return jsonify(get_cart()), 201


@bp.patch("/<int:item_id>")
@login_required
def change_quantity(item_id):
    quantity = read_quantity(request.get_json(silent=True) or {})
    if quantity is None:
        return jsonify(message="Количество должно быть целым числом больше нуля"), 400

    # user_id в условии не даёт изменить чужую корзину
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
