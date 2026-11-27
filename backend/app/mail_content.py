from dataclasses import dataclass
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

TEMPLATES = Environment(
    loader=FileSystemLoader(Path(__file__).with_name("email_templates")),
    autoescape=select_autoescape(["html"]),
    undefined=StrictUndefined,
    trim_blocks=True,
    lstrip_blocks=True,
)


@dataclass(frozen=True)
class MailContent:
    """Содержимое письма магазина."""

    subject: str
    heading: str
    body: str
    items: tuple[str, ...] = ()
    details: tuple[tuple[str, str], ...] = ()
    note: str = ""
    link_label: str = ""
    link_url: str = ""
    signature: str = "Команда COUNTUR"
    reply_to: str = ""

    def html(self) -> str:
        """Оформить HTML-версию письма."""

        return TEMPLATES.get_template("layout.html").render(letter=self)

    def text(self) -> str:
        """Оформить текстовую версию письма."""

        return TEMPLATES.get_template("layout.txt").render(letter=self)
