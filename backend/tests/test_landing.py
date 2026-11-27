"""Тесты сценариев главной страницы без БД."""

import asyncio
from io import BytesIO
from pathlib import Path

import pytest
from fastapi import UploadFile
from PIL import Image

from app import uploads
from app.config import Settings
from app.landing.models import Hero, HeroContent, Promotion
from app.landing.schemas import HeroContentSchema, HeroStatisticSchema, PromotionUpdateSchema
from app.landing.usecases.delete_hero_image import DeleteHeroImageUseCase
from app.landing.usecases.set_hero_image import SetHeroImageUseCase
from app.landing.usecases.set_promotion_image import SetPromotionImageUseCase
from app.landing.usecases.update_hero_content import UpdateHeroContentUseCase
from app.landing.usecases.update_promotion import UpdatePromotionUseCase
from app.uploads import UploadError


class FakeRepository:
    """Единственная строка блока главной в памяти: подходит и для первого экрана, и для рекламы."""

    def __init__(self) -> None:
        self.item = None

    async def lock_hero(self):
        return self.item

    async def edit_hero(self):
        return self.item or Hero(id=1)

    async def get_hero_content(self):
        return self.item

    async def edit_promotion(self):
        if self.item is None:
            self.item = Promotion()
        return self.item

    async def save(self, item):
        self.item = item

        return item


def make_upload(content: bytes) -> UploadFile:
    return UploadFile(file=BytesIO(content), filename="image.png")


def png_bytes() -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (20, 20), (20, 200, 240)).save(buffer, format="PNG")

    return buffer.getvalue()


@pytest.fixture
def media_dir(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    settings = Settings(
        database_url="postgresql+asyncpg://test:test@localhost:5432/test",
        jwt_secret="test-jwt-secret-not-for-production-123456",
        admin_password="test-admin-password",
        media_dir=str(tmp_path),
    )
    monkeypatch.setattr(uploads, "get_settings", lambda: settings)

    return tmp_path


def test_new_hero_image_replaces_previous_file(media_dir: Path) -> None:
    usecase = SetHeroImageUseCase(FakeRepository())

    first = asyncio.run(usecase.execute(make_upload(png_bytes())))
    first_path = first.image_path
    second = asyncio.run(usecase.execute(make_upload(png_bytes())))

    assert first_path != second.image_path
    assert not (media_dir / first_path).exists()
    assert (media_dir / second.image_path).exists()
    assert second.image_url == f"/media/{second.image_path}"


def test_hero_rejects_file_that_is_not_an_image(media_dir: Path) -> None:
    heroes = FakeRepository()

    with pytest.raises(UploadError):
        asyncio.run(SetHeroImageUseCase(heroes).execute(make_upload(b"not an image")))

    assert heroes.item is None
    assert list(media_dir.iterdir()) == []


@pytest.mark.parametrize("usecase", [SetHeroImageUseCase, SetPromotionImageUseCase])
def test_failed_image_update_keeps_previous_file(usecase, media_dir: Path, monkeypatch) -> None:
    blocks = FakeRepository()
    editor = usecase(blocks)
    saved = asyncio.run(editor.execute(make_upload(png_bytes())))
    previous = media_dir / saved.image_path

    async def fail_to_save(block):
        raise RuntimeError("Не удалось сохранить")

    monkeypatch.setattr(blocks, "save", fail_to_save)
    with pytest.raises(RuntimeError, match="Не удалось сохранить"):
        asyncio.run(editor.execute(make_upload(png_bytes())))

    assert list(previous.parent.iterdir()) == [previous]


def test_delete_hero_image_clears_path_and_file(media_dir: Path) -> None:
    heroes = FakeRepository()
    hero = asyncio.run(SetHeroImageUseCase(heroes).execute(make_upload(png_bytes())))
    image_path = media_dir / hero.image_path

    deleted = asyncio.run(DeleteHeroImageUseCase(heroes).execute())

    assert deleted.image_url is None
    assert not image_path.exists()


def test_promotion_update_keeps_image_and_image_keeps_texts(media_dir: Path) -> None:
    promotions = FakeRepository()
    payload = PromotionUpdateSchema(title="До −30% на видеокарты", is_visible=True)

    asyncio.run(UpdatePromotionUseCase(promotions).execute(payload))
    with_image = asyncio.run(SetPromotionImageUseCase(promotions).execute(make_upload(png_bytes())))

    assert with_image.title == "До −30% на видеокарты"
    assert with_image.is_visible is True

    hidden = asyncio.run(
        UpdatePromotionUseCase(promotions).execute(PromotionUpdateSchema(title="Новая акция"))
    )

    assert hidden.title == "Новая акция"
    assert hidden.is_visible is False
    assert (media_dir / hidden.image_path).exists()


def test_clear_hero_text_and_remove_empty_statistics():
    repository = FakeRepository()
    repository.item = HeroContent(title="Предыдущий заголовок")
    content = HeroContentSchema(
        is_visible=False,
        title="",
        overline="",
        description="Новый подзаголовок",
        catalog_button_label="Каталог",
        support_button_label="",
        image_alt="",
        image_badge="",
        statistics=[
            HeroStatisticSchema(value="", label=""),
            HeroStatisticSchema(value="24/7", label="Поддержка"),
        ],
    )

    saved = asyncio.run(UpdateHeroContentUseCase(repository).execute(content))

    assert saved.title == ""
    assert saved.description == "Новый подзаголовок"
    assert saved.is_visible is False
    assert saved.statistics == [{"value": "24/7", "label": "Поддержка"}]
