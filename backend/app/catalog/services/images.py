"""Сохранение фото товаров в media/products."""

from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError

from app.config import get_settings

MEGABYTE = 1024 * 1024
IMAGE_MAX_SIZE_BYTES = 5 * MEGABYTE
IMAGE_EXTENSIONS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}
PRODUCTS_FOLDER = "products"


class UploadError(ValueError):
    """Файл не подходит: это не картинка или превышен размер."""


def detect_extension(content: bytes) -> str:
    """Определить формат картинки по содержимому, а не по заголовку от клиента."""

    try:
        with Image.open(BytesIO(content)) as image:
            image.verify()
            image_format = image.format
    except (UnidentifiedImageError, OSError, SyntaxError) as error:
        raise UploadError("Файл не является изображением") from error

    extension = IMAGE_EXTENSIONS.get(image_format or "")
    if extension is None:
        raise UploadError("Допустимы только JPEG, PNG и WebP")

    return extension


async def save_product_image(file: UploadFile) -> str:
    """Сохранить фото товара. Возвращает путь относительно каталога media."""

    content = await file.read(IMAGE_MAX_SIZE_BYTES + 1)
    if len(content) > IMAGE_MAX_SIZE_BYTES:
        raise UploadError(f"Файл больше {IMAGE_MAX_SIZE_BYTES // MEGABYTE} МБ")

    extension = detect_extension(content)

    directory = Path(get_settings().media_dir) / PRODUCTS_FOLDER
    directory.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid4().hex}{extension}"
    (directory / filename).write_bytes(content)

    return f"{PRODUCTS_FOLDER}/{filename}"


def remove_product_image(path: str) -> None:
    """Удалить файл фото. Если его уже нет на диске, молчим: цель достигнута."""

    (Path(get_settings().media_dir) / path).unlink(missing_ok=True)
