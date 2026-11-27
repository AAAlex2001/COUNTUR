"""Сценарий удаления товара из избранного."""

from app.favorites.repository import FavoriteRepository


class RemoveFavoriteUseCase:
    """Убрать товар из избранного. Если его там нет, ничего не происходит."""

    def __init__(self, favorites: FavoriteRepository) -> None:
        self.favorites = favorites

    async def execute(self, user_id: int, product_id: int) -> None:
        """Убрать товар из избранного."""

        await self.favorites.remove(user_id, product_id)
