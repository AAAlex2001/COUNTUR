"""Сценарий удаления товара из избранного."""

from app.favorites.services.repo import FavoriteRepository


class RemoveFavoriteUseCase:
    """Убрать товар из избранного. Если его там нет, ничего не происходит."""

    def __init__(self, favorites: FavoriteRepository) -> None:
        self.favorites = favorites

    async def execute(self, visitor_id: str, product_id: int) -> None:
        """Убрать товар из избранного."""

        favorite = await self.favorites.get(visitor_id, product_id)
        if favorite is None:
            return

        await self.favorites.remove(favorite)
