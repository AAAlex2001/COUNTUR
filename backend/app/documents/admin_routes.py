from fastapi import APIRouter, Depends

from app.admin.dependencies import require_admin
from app.documents.dependencies import (
    get_document_by_slug,
    get_document_repository,
    get_update_document_usecase,
)
from app.documents.models import Document
from app.documents.schemas import DocumentSchema, DocumentUpdateSchema
from app.documents.services.repo import DocumentRepository
from app.documents.services.usecases.update_document import UpdateDocumentUseCase

router = APIRouter(
    prefix="/admin/documents",
    tags=["admin: documents"],
    dependencies=[Depends(require_admin)],
)


@router.get("")
async def list_documents(
    documents: DocumentRepository = Depends(get_document_repository),
) -> list[DocumentSchema]:
    """Все документы магазина."""

    items = await documents.list_all()

    return [DocumentSchema.model_validate(item) for item in items]


@router.get("/{slug}")
async def get_document(document: Document = Depends(get_document_by_slug)) -> DocumentSchema:
    """Документ для редактирования."""

    return DocumentSchema.model_validate(document)


@router.put("/{slug}")
async def update_document(
    payload: DocumentUpdateSchema,
    document: Document = Depends(get_document_by_slug),
    usecase: UpdateDocumentUseCase = Depends(get_update_document_usecase),
) -> DocumentSchema:
    """Новая редакция документа. HTML очищается от всего, чего нет в редакторе."""

    updated = await usecase.execute(document, payload)

    return DocumentSchema.model_validate(updated)
