import secrets
import uuid

from flask import Blueprint, current_app, jsonify, request
from minio import Minio

import config
from db import execute, fetch_one

bp = Blueprint("uploads", __name__, url_prefix="/api")

minio_client = Minio(
    config.MINIO_ENDPOINT,
    access_key=config.MINIO_ACCESS_KEY,
    secret_key=config.MINIO_SECRET_KEY,
    secure=config.MINIO_SECURE,
)


def upload_file(file):
    extension = file.filename.rpartition(".")[2].lower() if "." in file.filename else ""
    object_name = uuid.uuid4().hex
    if extension.isascii() and extension.isalnum():
        object_name += f".{extension}"
    minio_client.put_object(
        config.MINIO_BUCKET, object_name, file, length=-1,
        part_size=10 * 1024 * 1024, content_type=file.content_type,
    )
    return object_name, f"{config.MINIO_PUBLIC_URL}/{config.MINIO_BUCKET}/{object_name}"


@bp.post("/upload")
def upload():
    file = request.files.get("image")
    if not file or not file.filename:
        return jsonify(message="Файл не выбран"), 400
    try:
        _, url = upload_file(file)
    except Exception:
        current_app.logger.exception("MinIO upload failed")
        return jsonify(message="Не удалось загрузить файл"), 500
    return jsonify(url=url), 201


@bp.post("/uploads/product-image")
def upload_product_image():
    supplied = request.headers.get("X-Upload-Token", "")
    if not config.UPLOAD_ADMIN_TOKEN or not secrets.compare_digest(
        supplied.encode(), config.UPLOAD_ADMIN_TOKEN.encode()
    ):
        return jsonify(message="Нет доступа к изменению каталога"), 403

    file = request.files.get("image")
    if not file or not file.filename:
        return jsonify(message="Файл не выбран"), 400

    product_id = request.form.get("product_id", type=int)
    if product_id is None or not 1 <= product_id <= 2147483647:
        return jsonify(message="Укажите корректный ID товара"), 400
    if not fetch_one("SELECT id FROM products WHERE id = %s", (product_id,)):
        return jsonify(message="Товар не найден"), 404

    color = request.form.get("color", "").strip()
    if color and not fetch_one(
        "SELECT id FROM product_variants WHERE product_id = %s AND color = %s LIMIT 1",
        (product_id, color),
    ):
        return jsonify(message="У товара нет такого цвета"), 400

    try:
        object_name, url = upload_file(file)
    except Exception:
        current_app.logger.exception("MinIO upload failed")
        return jsonify(message="Не удалось загрузить файл"), 500

    if color:
        updated = execute(
            """
            UPDATE products
            SET images = array_append(COALESCE(images, '{}'), %s),
                color_images = COALESCE(color_images, '{}'::jsonb)
                    || jsonb_build_object(%s::text, %s::text)
            WHERE id = %s
            """,
            (url, color, url, product_id),
        )
    else:
        updated = execute(
            "UPDATE products SET images = array_append(COALESCE(images, '{}'), %s) WHERE id = %s",
            (url, product_id),
        )
    if not updated:
        minio_client.remove_object(config.MINIO_BUCKET, object_name)
        return jsonify(message="Товар не найден"), 404

    return jsonify(url=url, message="Картинка привязана к товару"), 201
