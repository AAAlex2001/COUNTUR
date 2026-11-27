import nh3

ALLOWED_TAGS = {
    "p",
    "h2",
    "h3",
    "strong",
    "em",
    "u",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "br",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
}
ALLOWED_ATTRIBUTES = {"a": {"href"}}
URL_SCHEMES = {"http", "https", "mailto", "tel"}


def sanitize_content(html: str) -> str:
    """Очистить разметку документа."""

    return nh3.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        url_schemes=URL_SCHEMES,
    ).strip()
