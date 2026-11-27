from fastapi import Depends, HTTPException, status

from app.database import DatabaseSession
from app.documents.models import Document
from app.documents.repository import DocumentRepository
from app.documents.usecases.update_document import UpdateDocumentUseCase


def get_document_repository(db: DatabaseSession) -> DocumentRepository:
    """Открыть документы магазина."""

    return DocumentRepository(db=db)


async def get_document_by_slug(
    slug: str,
    documents: DocumentRepository = Depends(get_document_repository),
) -> Document:
    """Найти документ магазина."""

    document = await documents.get_by_slug(slug)
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Документ не найден",
        )

    return document


def get_update_document_usecase(
    documents: DocumentRepository = Depends(get_document_repository),
) -> UpdateDocumentUseCase:
    """Подготовить обновление документа."""

    return UpdateDocumentUseCase(documents=documents)
