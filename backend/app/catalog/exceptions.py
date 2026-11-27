"""Ошибки бизнес-логики каталога. Роутеры переводят их в HTTP-коды."""


class ProductNotFoundError(LookupError):
    """Товара нет или он не опубликован."""


class CategoryNotFoundError(LookupError):
    """Категории с таким идентификатором или адресом нет."""


class BrandNotFoundError(LookupError):
    """Бренда с таким идентификатором нет."""


class AttributeNotFoundError(LookupError):
    """Параметра категории с таким идентификатором нет."""


class ImageNotFoundError(LookupError):
    """У товара нет фото с таким идентификатором."""


class ReviewNotFoundError(LookupError):
    """Отзыва с таким идентификатором нет."""


class InvalidFilterError(ValueError):
    """Фильтр каталога задан неверно."""


class InvalidProductError(ValueError):
    """Данные товара нарушают правила каталога."""


class SkuAlreadyTakenError(ValueError):
    """Артикул уже занят другим товаром."""


class AttributeAlreadyExistsError(ValueError):
    """В категории уже есть параметр с таким названием."""


class CategoryInUseError(ValueError):
    """Категорию нельзя удалить, пока в ней есть товары."""
