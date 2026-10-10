"""Репозиторий документов: только запросы к таблице documents."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.documents.models import Document


class DocumentRepository:
    """Доступ к таблице documents. Сессию получает снаружи, коммитит сам."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_all(self) -> list[Document]:
        """Все документы в порядке создания."""

        result = await self.db.execute(select(Document).order_by(Document.id))

        return list(result.scalars().all())

    async def get_by_slug(self, slug: str) -> Document | None:
        """Документ по адресу или None."""

        result = await self.db.execute(select(Document).where(Document.slug == slug))

        return result.scalar_one_or_none()

    async def save(self, document: Document) -> Document:
        """Сохранить изменения документа."""

        await self.db.commit()
        await self.db.refresh(document)

        return document
