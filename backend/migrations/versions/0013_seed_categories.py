"""seed starter categories with their attributes

Категории с адресами, под которые на главной уже есть иконки. Если категория с таким адресом
уже заведена вручную, её не трогаем.

Revision ID: 0013
Revises: 0012
Create Date: 2026-11-13
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0013"
down_revision: Union[str, None] = "0012"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Адрес, название и параметры: группа, название, показывать ли фильтром в каталоге.
CATEGORIES = [
    (
        "processors",
        "Процессоры",
        [
            ("Основное", "Сокет", True),
            ("Основное", "Количество ядер", True),
            ("Основное", "Количество потоков", False),
            ("Частоты", "Базовая частота", False),
            ("Частоты", "Максимальная частота", False),
            ("Прочее", "Кэш L3", False),
            ("Прочее", "Тепловыделение (TDP)", False),
            ("Прочее", "Встроенная графика", True),
        ],
    ),
    (
        "video-cards",
        "Видеокарты",
        [
            ("Основное", "Графический процессор", True),
            ("Основное", "Объём памяти", True),
            ("Основное", "Тип памяти", True),
            ("Основное", "Шина памяти", False),
            ("Частоты", "Частота ядра", False),
            ("Частоты", "Частота в бусте", False),
            ("Подключение", "Видеовыходы", False),
            ("Подключение", "Разъёмы питания", False),
            ("Подключение", "Рекомендуемый блок питания", False),
        ],
    ),
    (
        "motherboards",
        "Материнские платы",
        [
            ("Основное", "Сокет", True),
            ("Основное", "Чипсет", True),
            ("Основное", "Форм-фактор", True),
            ("Память", "Тип памяти", True),
            ("Память", "Слотов памяти", False),
            ("Память", "Максимальный объём памяти", False),
            ("Подключение", "Слоты M.2", False),
            ("Подключение", "Порты SATA", False),
            ("Подключение", "Wi-Fi", True),
        ],
    ),
    (
        "memory",
        "Оперативная память",
        [
            ("Основное", "Тип памяти", True),
            ("Основное", "Объём комплекта", True),
            ("Основное", "Модулей в комплекте", False),
            ("Основное", "Частота", True),
            ("Прочее", "Тайминги", False),
            ("Прочее", "Напряжение", False),
            ("Прочее", "Подсветка", False),
        ],
    ),
    (
        "storage",
        "Накопители",
        [
            ("Основное", "Тип накопителя", True),
            ("Основное", "Объём", True),
            ("Основное", "Форм-фактор", True),
            ("Основное", "Интерфейс", True),
            ("Скорость", "Скорость чтения", False),
            ("Скорость", "Скорость записи", False),
            ("Прочее", "Ресурс записи (TBW)", False),
        ],
    ),
    (
        "power-supplies",
        "Блоки питания",
        [
            ("Основное", "Мощность", True),
            ("Основное", "Сертификат 80 PLUS", True),
            ("Основное", "Модульность", True),
            ("Основное", "Форм-фактор", False),
            ("Разъёмы", "Питание процессора", False),
            ("Разъёмы", "Питание видеокарты", False),
            ("Прочее", "Размер вентилятора", False),
        ],
    ),
    (
        "cases",
        "Корпуса",
        [
            ("Основное", "Типоразмер", True),
            ("Основное", "Поддержка плат", True),
            ("Основное", "Цвет", True),
            ("Основное", "Боковое окно", True),
            ("Размеры", "Максимальная длина видеокарты", False),
            ("Размеры", "Максимальная высота кулера", False),
            ("Охлаждение", "Вентиляторов в комплекте", False),
            ("Охлаждение", "Поддержка радиаторов", False),
        ],
    ),
    (
        "cooling",
        "Системы охлаждения",
        [
            ("Основное", "Тип охлаждения", True),
            ("Основное", "Сокеты", True),
            ("Основное", "Рассеиваемая мощность", True),
            ("Вентиляторы", "Размер вентилятора", False),
            ("Вентиляторы", "Количество вентиляторов", False),
            ("Вентиляторы", "Уровень шума", False),
            ("Прочее", "Высота", False),
            ("Прочее", "Подсветка", False),
        ],
    ),
]


def upgrade() -> None:
    bind = op.get_bind()

    for position, (slug, name, attributes) in enumerate(CATEGORIES, start=1):
        exists = bind.execute(
            sa.text("SELECT 1 FROM categories WHERE slug = :slug"), {"slug": slug}
        ).scalar()
        if exists:
            continue

        category_id = bind.execute(
            sa.text(
                "INSERT INTO categories (slug, name, sort_order) "
                "VALUES (:slug, :name, :sort_order) RETURNING id"
            ),
            {"slug": slug, "name": name, "sort_order": position * 10},
        ).scalar_one()

        bind.execute(
            sa.text(
                "INSERT INTO attributes (category_id, group_name, name, is_filterable, sort_order) "
                "VALUES (:category_id, :group_name, :name, :is_filterable, :sort_order)"
            ),
            [
                {
                    "category_id": category_id,
                    "group_name": group,
                    "name": attribute,
                    "is_filterable": filterable,
                    "sort_order": order * 10,
                }
                for order, (group, attribute, filterable) in enumerate(attributes, start=1)
            ],
        )


def downgrade() -> None:
    # Стартовые категории к этому времени уже могут быть с товарами, поэтому не удаляем.
    pass
