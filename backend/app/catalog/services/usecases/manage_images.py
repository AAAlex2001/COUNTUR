"""Сценарии работы с фото товара: добавить, удалить, изменить порядок."""

from fastapi import UploadFile

from app.catalog.models import Product, ProductImage, PublicationStatus
from app.catalog.services.exceptions import ImageNotFoundError, InvalidProductError
from app.catalog.services.images import remove_product_image, save_product_image
from app.catalog.services.repo import ProductRepository


class AddProductImageUseCase:
    """Загрузить фото и поставить его последним в галерее товара."""

    def __init__(self, products: ProductRepository) -> None:
        self.products = products

    async def execute(self, product: Product, file: UploadFile) -> Product:
        """Вернуть товар с новым фото. Бросает UploadError, если файл не подходит."""

        path = await save_product_image(file)

        last_order = max((image.sort_order for image in product.images), default=-1)
        product.images.append(ProductImage(path=path, sort_order=last_order + 1))

        try:
            return await self.products.save(product)
        except Exception:
            remove_product_image(path)
            raise


class RemoveProductImageUseCase:
    """Удалить фото товара из галереи и с диска."""

    def __init__(self, products: ProductRepository) -> None:
        self.products = products

    async def execute(self, product: Product, image_id: int) -> Product:
        """Вернуть товар без фото. Бросает ImageNotFoundError и InvalidProductError."""

        image = next((item for item in product.images if item.id == image_id), None)
        if image is None:
            raise ImageNotFoundError(image_id)

        if product.status == PublicationStatus.PUBLISHED and len(product.images) == 1:
            raise InvalidProductError("У опубликованного товара должно остаться хотя бы одно фото")

        path = image.path
        product.images.remove(image)

        updated = await self.products.save(product)
        remove_product_image(path)

        return updated


class ReorderProductImagesUseCase:
    """Расставить фото товара в новом порядке. Первое становится главным."""

    def __init__(self, products: ProductRepository) -> None:
        self.products = products

    async def execute(self, product: Product, image_ids: list[int]) -> Product:
        """Вернуть товар с новым порядком фото. В списке должны быть все фото товара."""

        images = {image.id: image for image in product.images}

        if len(image_ids) != len(images) or set(image_ids) != set(images):
            raise InvalidProductError("Передайте идентификаторы всех фото товара по одному разу")

        for position, image_id in enumerate(image_ids):
            images[image_id].sort_order = position

        return await self.products.save(product)
