from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.documents.models import Document


class DocumentRepository:
    """Документы магазина."""

    def __init__(self, db: AsyncSession) -> None:
        """Подключить сессию базы."""

        self.db = db

    async def list_all(self) -> list[Document]:
        """Получить список документов."""

        documents = await self.db.scalars(select(Document).order_by(Document.id))

        return list(documents)

    async def get_by_slug(self, slug: str) -> Document | None:
        """Найти документ по адресу."""

        return await self.db.scalar(select(Document).where(Document.slug == slug))

    async def save(self, document: Document) -> Document:
        """Сохранить изменения документа."""

        await self.db.commit()
        await self.db.refresh(document)

        return document
