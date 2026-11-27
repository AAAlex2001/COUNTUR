from app.documents.content import sanitize_content
from app.documents.models import Document
from app.documents.repository import DocumentRepository
from app.documents.schemas import DocumentUpdateSchema


class UpdateDocumentUseCase:
    """Редактирование документа."""

    def __init__(self, documents: DocumentRepository) -> None:
        """Подключить документы магазина."""

        self.documents = documents

    async def execute(self, document: Document, payload: DocumentUpdateSchema) -> Document:
        """Сохранить документ магазина."""

        document.title = payload.title
        document.description = payload.description
        document.content = sanitize_content(payload.content)

        return await self.documents.save(document)
