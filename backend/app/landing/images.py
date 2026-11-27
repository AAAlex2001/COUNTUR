from app.landing.models import Hero, Promotion
from app.landing.repository import LandingRepository
from app.uploads import ImageUpload, remove_image, save_image


async def replace_landing_image(
    file: ImageUpload, block: Hero | Promotion, landing: LandingRepository
) -> None:
    """Заменить картинку блока."""

    new_path = await save_image(file, "landing")
    previous_path = block.image_path
    block.image_path = new_path

    try:
        await landing.save(block)
    except Exception:
        remove_image(new_path)
        raise

    remove_image(previous_path)
