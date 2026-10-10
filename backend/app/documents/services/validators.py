"""Очистка HTML документа: остаются только теги, которые умеет редактор."""

import nh3

ALLOWED_TAGS = {"p", "h2", "h3", "strong", "em", "u", "ul", "ol", "li", "blockquote", "a", "br"}
ALLOWED_ATTRIBUTES = {"a": {"href"}}
URL_SCHEMES = {"http", "https", "mailto", "tel"}


def sanitize_content(html: str) -> str:
    """Убрать скрипты, обработчики событий, стили и незнакомые теги. Ссылки получают rel=noopener."""

    return nh3.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        url_schemes=URL_SCHEMES,
    ).strip()
