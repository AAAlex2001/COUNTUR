from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DocumentSchema(BaseModel):
    """Документ магазина целиком."""

    model_config = ConfigDict(from_attributes=True)

    slug: str = Field(..., description="Адрес страницы, он же идентификатор")
    title: str = Field(..., description="Заголовок")
    description: str = Field(..., description="Подзаголовок под названием")
    content: str = Field(..., description="Текст документа в HTML")
    updated_at: datetime = Field(..., description="Дата редакции")


class DocumentUpdateSchema(BaseModel):
    """Новая редакция документа. HTML перед сохранением очищается от лишнего."""

    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field("", max_length=500)
    content: str = Field(..., max_length=200_000)
