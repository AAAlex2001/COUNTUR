from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.config import MEDIA_URL
from app.database import Base


class Hero(Base):
    """Первый экран главной страницы. В таблице одна строка."""

    __tablename__ = "landing_hero"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    image_path: Mapped[str | None] = mapped_column(String(255))

    @property
    def image_url(self) -> str | None:
        """Адрес картинки для сайта или None, если её ещё не загрузили."""

        if self.image_path is None:
            return None

        return f"{MEDIA_URL}/{self.image_path}"


class Promotion(Base):
    """Рекламный блок главной страницы. В таблице одна строка."""

    __tablename__ = "landing_promotion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    label: Mapped[str] = mapped_column(String(100), default="")
    title: Mapped[str] = mapped_column(String(150), default="")
    text: Mapped[str] = mapped_column(String(300), default="")
    button_label: Mapped[str] = mapped_column(String(60), default="")
    button_url: Mapped[str] = mapped_column(String(255), default="")
    image_path: Mapped[str | None] = mapped_column(String(255))
    is_visible: Mapped[bool] = mapped_column(Boolean, default=False)

    @property
    def image_url(self) -> str | None:
        """Адрес картинки для сайта или None, если её ещё не загрузили."""

        if self.image_path is None:
            return None

        return f"{MEDIA_URL}/{self.image_path}"
