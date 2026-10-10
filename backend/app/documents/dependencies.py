"""Документы: репозиторий, сценарий правки и загрузка документа по адресу из пути."""

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.documents.models import Document
from app.documents.services.repo import DocumentRepository
from app.documents.services.usecases.update_document import UpdateDocumentUseCase


def get_document_repository(
    session: AsyncSession = Depends(get_session),
) -> DocumentRepository:
    """Репозиторий документов с сессией текущего запроса."""

    return DocumentRepository(session)


async def get_document_by_slug(
    slug: str,
    documents: DocumentRepository = Depends(get_document_repository),
) -> Document:
    """Документ по адресу из пути. Отсутствующий — 404."""

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
    """Сценарий новой редакции документа."""

    return UpdateDocumentUseCase(documents)
