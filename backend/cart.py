from flask import Blueprint, g, jsonify, request

from auth import login_required
from db import execute, fetch_all, get_db

bp = Blueprint("cart", __name__, url_prefix="/api/cart")


def get_cart():
    """Позиции корзины текущего пользователя вместе с данными товара."""
    return fetch_all(
        """
        SELECT c.id,
               v.product_id AS "productId",
               c.variant_id AS "variantId",
               p.name,
               p.category,
               p.price,
               COALESCE(to_jsonb(p) -> 'color_images' ->> v.color, p.images[1]) AS image,
               v.size,
               v.color,
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
    quantity = data.get("quantity", default) if isinstance(data, dict) else None
    if type(quantity) is not int or not 1 <= quantity <= 2147483647:
        return None
    return quantity


@bp.get("")
@login_required
def show_cart():
    return jsonify(get_cart())


@bp.post("")
@login_required
def add_to_cart():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(message="Ожидается JSON-объект"), 400

    variant_id = data.get("variantId")
    quantity = read_quantity(data, default=1)
    if quantity is None:
        return jsonify(message="Количество должно быть целым числом больше нуля"), 400
    if type(variant_id) is not int or not 1 <= variant_id <= 2147483647:
        return jsonify(message="Укажите вариант товара"), 400

    db = get_db()
    with db, db.cursor() as cursor:
        # Сериализуем добавления в корзину пользователя без требования к уникальному индексу.
        cursor.execute("SELECT id FROM users WHERE id = %s FOR NO KEY UPDATE", (g.user_id,))
        cursor.execute("SELECT id FROM product_variants WHERE id = %s FOR KEY SHARE", (variant_id,))
        if cursor.fetchone() is None:
            return jsonify(message="Вариант товара не найден"), 404

        cursor.execute(
            """
            UPDATE cart_items SET quantity = quantity + %s
            WHERE id = (
                SELECT id FROM cart_items WHERE user_id = %s AND variant_id = %s
                ORDER BY id LIMIT 1
            )
            """,
            (quantity, g.user_id, variant_id),
        )
        if cursor.rowcount == 0:
            cursor.execute(
                "INSERT INTO cart_items (user_id, variant_id, quantity) VALUES (%s, %s, %s)",
                (g.user_id, variant_id, quantity),
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