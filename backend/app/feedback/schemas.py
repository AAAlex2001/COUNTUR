from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.feedback.models import FeedbackStatus


class FeedbackCreateSchema(BaseModel):
    """Обращение с формы контактов. Без согласия на обработку данных не принимается."""

    name: str = Field(..., min_length=2, max_length=150, description="Как обращаться")
    email: EmailStr = Field(..., max_length=254, description="Куда ответить")
    subject: str = Field(..., min_length=2, max_length=200, description="Тема")
    message: str = Field(..., min_length=10, max_length=5000, description="Текст обращения")
    consent: Literal[True] = Field(..., description="Согласие на обработку данных")


class FeedbackCreatedSchema(BaseModel):
    """Номер принятого обращения."""

    id: int = Field(..., description="Номер обращения")


class FeedbackSchema(BaseModel):
    """Обращение для админки вместе с ответом, если он уже отправлен."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="Номер обращения")
    name: str = Field(..., description="Имя отправителя")
    email: str = Field(..., description="Email отправителя")
    subject: str = Field(..., description="Тема")
    message: str = Field(..., description="Текст обращения")
    status: FeedbackStatus = Field(..., description="Статус")
    reply: str | None = Field(None, description="Текст ответа")
    answered_at: datetime | None = Field(None, description="Когда отвечено")
    created_at: datetime = Field(..., description="Когда получено")


class FeedbackListSchema(BaseModel):
    """Страница обращений в админке."""

    messages: list[FeedbackSchema]
    total: int = Field(..., description="Сколько обращений подходит под фильтр")


class FeedbackReplySchema(BaseModel):
    """Ответ администратора: уходит письмом на email отправителя."""

    text: str = Field(..., min_length=2, max_length=5000, description="Текст ответа")
