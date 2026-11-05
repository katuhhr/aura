import uuid
import config
from flask import Blueprint, request, jsonify
from minio import Minio
from db import execute


bp = Blueprint("uploads", __name__, url_prefix="/api/uploads")

minio_client = Minio(
    config.MINIO_ENDPOINT,
    access_key=config.MINIO_ACCESS_KEY,
    secret_key=config.MINIO_SECRET_KEY,
    secure=config.MINIO_SECURE
)

@bp.post("/image")
def upload_image():

    if 'image' not in request.files:
        return jsonify(message="Файл не передан"), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify(message="Пустое имя файла"), 400
import uuid
import config

from flask import Blueprint, request, jsonify
from minio import Minio

bp = Blueprint("uploads", __name__, url_prefix="/api/uploads")

minio_client = Minio(
    config.MINIO_ENDPOINT,
    access_key=config.MINIO_ACCESS_KEY,
    secret_key=config.MINIO_SECRET_KEY,
    secure=config.MINIO_SECURE
)


@bp.post("/image")
def upload_image():
    if "image" not in request.files:
        return jsonify(message="Файл не передан"), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify(message="Пустое имя файла"), 400

    ext = file.filename.rsplit(".", 1)[-1].lower()
    object_name = f"{uuid.uuid4().hex}.{ext}"

    try:
        minio_client.put_object(
            config.MINIO_BUCKET,
            object_name,
            file,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=file.content_type
        )

        image_url = (
            f"http://localhost:9000/"
            f"{config.MINIO_BUCKET}/{object_name}"
        )

        return jsonify(url=image_url), 201

    except Exception as e:
        print(f"Ошибка MinIO: {e}")
        return jsonify(message=f"Ошибка загрузки: {str(e)}"), 500
