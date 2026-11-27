"""Сохранение загруженных картинок в каталог media."""

import logging
from io import BytesIO
from pathlib import Path
from typing import Protocol
from uuid import uuid4

from PIL import Image, UnidentifiedImageError

from app.config import get_settings

logger = logging.getLogger(__name__)
MEGABYTE = 1024 * 1024
IMAGE_MAX_SIZE_BYTES = 5 * MEGABYTE
IMAGE_EXTENSIONS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}


class ImageUpload(Protocol):
    """Загружаемое изображение."""

    async def read(self, size: int) -> bytes:
        """Прочитать часть файла."""
        ...


class UploadError(ValueError):
    """Файл не подходит: это не картинка или превышен размер."""


def detect_extension(content: bytes) -> str:
    """Определить формат картинки по содержимому, а не по заголовку от клиента."""

    try:
        with Image.open(BytesIO(content)) as image:
            image.verify()
            image_format = image.format
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError, SyntaxError) as error:
        raise UploadError("Файл не является изображением") from error

    extension = IMAGE_EXTENSIONS.get(image_format or "")
    if extension is None:
        raise UploadError("Допустимы только JPEG, PNG и WebP")

    return extension


async def save_image(file: ImageUpload, folder: str) -> str:
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


def remove_image(path: str | None) -> None:
    """Удалить неиспользуемую картинку."""

    if path is None:
        return

    try:
        (Path(get_settings().media_dir) / path).unlink(missing_ok=True)
    except OSError:
        logger.exception("Не удалось удалить файл изображения %s", path)
