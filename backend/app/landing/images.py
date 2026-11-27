import logging

from fastapi import UploadFile

from app.landing.models import Hero, Promotion
from app.landing.repository import LandingRepository
from app.uploads import remove_image, save_image

logger = logging.getLogger(__name__)


async def replace_landing_image(
    file: UploadFile, block: Hero | Promotion, landing: LandingRepository
) -> None:
    """Заменить картинку блока."""

    new_path = await save_image(file, "landing")
    previous_path = block.image_path
    block.image_path = new_path

    try:
        await landing.save(block)
    except Exception:
        remove_landing_image(new_path)
        raise

    remove_landing_image(previous_path)


def remove_landing_image(path: str | None) -> None:
    """Удалить прежнюю картинку."""

    if path is None:
        return

    try:
        remove_image(path)
    except OSError:
        logger.exception("Не удалось удалить картинку главной: %s", path)
