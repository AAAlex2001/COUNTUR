"""Сценарий новой редакции документа."""

from app.documents.models import Document
from app.documents.schemas import DocumentUpdateSchema
from app.documents.services.repo import DocumentRepository
from app.documents.services.validators import sanitize_content


class UpdateDocumentUseCase:
    """Сохранить заголовок, подзаголовок и очищенный текст документа."""

    def __init__(self, documents: DocumentRepository) -> None:
        self.documents = documents

    async def execute(self, document: Document, payload: DocumentUpdateSchema) -> Document:
        """Вернуть сохранённый документ. Дата редакции обновляется сама."""

        document.title = payload.title.strip()
        document.description = payload.description.strip()
        document.content = sanitize_content(payload.content)

        return await self.documents.save(document)
