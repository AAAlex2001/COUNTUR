"""Сохранение загруженных картинок в каталог media."""

from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError

from app.config import get_settings

MEGABYTE = 1024 * 1024
IMAGE_MAX_SIZE_BYTES = 5 * MEGABYTE
IMAGE_EXTENSIONS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}


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


async def save_image(file: UploadFile, folder: str) -> str:
    """Сохранить картинку в папку внутри media. Возвращает путь относительно media."""

    content = await file.read(IMAGE_MAX_SIZE_BYTES + 1)
    if len(content) > IMAGE_MAX_SIZE_BYTES:
        raise UploadError(f"Файл больше {IMAGE_MAX_SIZE_BYTES // MEGABYTE} МБ")

    extension = detect_extension(content)

    directory = Path(get_settings().media_dir) / folder
    directory.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid4().hex}{extension}"
    (directory / filename).write_bytes(content)

    return f"{folder}/{filename}"


def remove_image(path: str) -> None:
    """Удалить файл картинки. Если его уже нет на диске, молчим: цель достигнута."""

    (Path(get_settings().media_dir) / path).unlink(missing_ok=True)
