"""Сценарий удаления товара."""

from app.catalog.models import Product
from app.catalog.services.repo import ProductRepository
from app.uploads import remove_image


class DeleteProductUseCase:
    """Удалить товар вместе с файлами его фото."""

    def __init__(self, products: ProductRepository) -> None:
        self.products = products

    async def execute(self, product: Product) -> None:
        """Удалить товар и его фото с диска."""

        paths = [image.path for image in product.images]

        await self.products.delete(product)

        for path in paths:
            remove_image(path)
