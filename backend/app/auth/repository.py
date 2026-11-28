"""Доступ к активным сессиям авторизации."""

from datetime import UTC, datetime

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.models import AuthSession
from app.tokens import AuthToken, TokenClaims, TokenRole, read_token


class AuthSessionRepository:
    """Создать, проверить или отозвать сессию входа."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, token: AuthToken) -> None:
        """Сохранить новый вход и удалить истёкшие сессии."""

        now = datetime.now(UTC)
        await self.db.execute(delete(AuthSession).where(AuthSession.expires_at <= now))
        self.db.add(
            AuthSession(
                id=token.session_id,
                subject=token.subject,
                role=token.role.value,
                expires_at=token.expires_at,
            )
        )
        await self.db.commit()

    async def is_active(self, claims: TokenClaims) -> bool:
        """Проверить, что сессию ещё не отозвали и она не истекла."""

        session_id = await self.db.scalar(
            select(AuthSession.id).where(
                AuthSession.id == claims.session_id,
                AuthSession.subject == claims.subject,
                AuthSession.role == claims.role.value,
                AuthSession.expires_at > datetime.now(UTC),
            )
        )
        return session_id is not None

    async def revoke_token(self, token: str | None, role: TokenRole) -> None:
        """Отозвать сессию из cookie, если токен действителен."""

        claims = read_token(token, role)
        if claims is None:
            return

        await self.db.execute(
            delete(AuthSession).where(
                AuthSession.id == claims.session_id,
                AuthSession.subject == claims.subject,
                AuthSession.role == claims.role.value,
            )
        )
        await self.db.commit()

