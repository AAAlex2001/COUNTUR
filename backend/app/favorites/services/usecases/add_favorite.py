"""Сценарий добавления товара в избранное."""

from app.catalog.services.exceptions import ProductNotFoundError
from app.catalog.services.repo import ProductRepository
from app.favorites.models import Favorite
from app.favorites.services.repo import FavoriteRepository


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

        existing = await self.favorites.get(user_id, product_id)
        if existing is not None:
            return

        await self.favorites.add(Favorite(user_id=user_id, product_id=product_id))
