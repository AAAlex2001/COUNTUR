from urllib.parse import quote

from app.mail_content import MailContent


def stock_notification(product_name: str, product_slug: str, site_url: str) -> MailContent:
    """Подготовить письмо о поступлении."""

    slug = quote(product_slug, safe="")
    return MailContent(
        subject=f"Снова в наличии — {product_name}",
        heading="Товар снова в наличии",
        body=f"Вы просили сообщить, когда появится {product_name}. Теперь его можно заказать.",
        link_label="Открыть товар",
        link_url=f"{site_url.rstrip('/')}/product/{slug}",
    )
