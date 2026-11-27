"""Тесты очистки HTML документа."""

import pytest
from pydantic import ValidationError

from app.documents.content import sanitize_content
from app.documents.schemas import DocumentUpdateSchema


def test_document_title_cannot_be_whitespace() -> None:
    with pytest.raises(ValidationError):
        DocumentUpdateSchema(title="   ", content="<p>Текст</p>")


def test_keeps_editor_markup() -> None:
    html = (
        "<h2>Раздел</h2><p><strong>Жирный</strong> и <em>курсив</em></p>"
        "<ul><li><p>Пункт</p></li></ul><blockquote><p>Поле</p></blockquote>"
    )

    assert sanitize_content(html) == html


def test_removes_scripts_handlers_and_styles() -> None:
    dirty = (
        '<p onclick="steal()" style="color:red">Текст</p>'
        "<script>alert(1)</script><img src=x onerror=alert(1)><h1>Крупно</h1>"
    )

    clean = sanitize_content(dirty)

    assert clean == "<p>Текст</p>Крупно"


def test_keeps_safe_links_only() -> None:
    assert (
        sanitize_content('<a href="https://countur.ru" target="_blank">сайт</a>')
        == '<a href="https://countur.ru" rel="noopener noreferrer">сайт</a>'
    )
    assert (
        sanitize_content('<a href="javascript:alert(1)">x</a>')
        == '<a rel="noopener noreferrer">x</a>'
    )


def test_preserves_editable_table() -> None:
    """Сохранить заголовки и ячейки."""

    header = "<thead><tr><th><p>№</p></th><th><p>Цель</p></th></tr></thead>"
    rows = "<tbody><tr><td><p>1</p></td><td><p>Первая строка<br>Вторая строка</p></td></tr></tbody>"
    table = f"<table>{header}{rows}</table>"

    assert sanitize_content(table) == table
