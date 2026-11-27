"""Сценарий добавления товара в избранное."""

from app.catalog.exceptions import ProductNotFoundError
from app.catalog.repositories.products import ProductRepository
from app.favorites.repository import FavoriteRepository


class AddFavoriteUseCase:
    """Добавить товар в избранное. Повторное добавление ничего не меняет."""

    def __init__(self, favorites: FavoriteRepository, products: ProductRepository) -> None:
        self.favorites = favorites
        self.products = products

    async def execute(self, user_id: int, product_id: int) -> None:
        """Добавить товар. Бросает ProductNotFoundError."""

        product = await self.products.get_published_by_id(product_id, lock=True)
        if product is None:
            raise ProductNotFoundError(product_id)

        await self.favorites.add(user_id, product_id)
