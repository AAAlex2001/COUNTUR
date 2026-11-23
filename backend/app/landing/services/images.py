import logging

from app.uploads import remove_image

logger = logging.getLogger(__name__)


def remove_hero_image_file(path: str) -> None:
    """Удаляет файл, который больше не используется первым экраном."""

    try:
        remove_image(path)
    except OSError:
        logger.exception("Не удалось удалить файл первого экрана: %s", path)
