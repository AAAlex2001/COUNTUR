from pydantic import BaseModel, ConfigDict, Field


class HeroSchema(BaseModel):
    """Первый экран главной страницы."""

    model_config = ConfigDict(from_attributes=True)

    image_url: str | None = Field(None, description="Адрес картинки. Пусто, пока её не загрузили")


class HeroStatisticSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    value: str = Field(max_length=40)
    label: str = Field(max_length=60)


class HeroContentSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)

    is_visible: bool
    overline: str = Field(max_length=100)
    title: str = Field(max_length=150)
    description: str = Field(max_length=500)
    catalog_button_label: str = Field(max_length=60)
    support_button_label: str = Field(max_length=60)
    image_alt: str = Field(max_length=150)
    image_badge: str = Field(max_length=60)
    statistics: list[HeroStatisticSchema] = Field(max_length=8)


class PromotionUpdateSchema(BaseModel):
    """Содержимое рекламного блока, которое задаёт администратор."""

    label: str = Field("", max_length=100, description="Надстрочник, например срок акции")
    title: str = Field("", max_length=150, description="Заголовок")
    text: str = Field("", max_length=300, description="Описание")
    button_label: str = Field("", max_length=60, description="Надпись на кнопке")
    button_url: str = Field("", max_length=255, description="Куда ведёт кнопка")
    is_visible: bool = Field(False, description="Показывать блок на главной")


class PromotionSchema(PromotionUpdateSchema):
    """Рекламный блок главной страницы."""

    model_config = ConfigDict(from_attributes=True)

    image_url: str | None = Field(None, description="Адрес картинки. Пусто, пока её не загрузили")
