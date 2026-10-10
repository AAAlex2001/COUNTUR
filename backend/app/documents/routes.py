from fastapi import APIRouter, Depends

from app.documents.dependencies import get_document_by_slug
from app.documents.models import Document
from app.documents.schemas import DocumentSchema

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/{slug}")
async def get_document(document: Document = Depends(get_document_by_slug)) -> DocumentSchema:
    """Документ магазина для страницы сайта."""

    return DocumentSchema.model_validate(document)
