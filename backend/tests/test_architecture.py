"""Границы зависимостей бэкенда."""

import ast
from collections.abc import Iterator
from importlib.util import resolve_name
from pathlib import Path

APP = Path(__file__).resolve().parents[1] / "app"
REPOSITORIES = {"repo", "repository", "repositories"}
HTTP = {"fastapi", "starlette", "routes", "admin_routes", "dependencies"}


def imported_names(path: Path) -> Iterator[str]:
    """Прочитать импорты модуля."""

    package = ".".join(path.parent.relative_to(APP.parent).parts)
    module = ast.parse(path.read_text(encoding="utf-8-sig"))
    for node in ast.walk(module):
        if isinstance(node, ast.Import):
            yield from (alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            source = resolve_name("." * node.level + (node.module or ""), package)
            yield from (f"{source}.{alias.name}" for alias in node.names)


def test_use_cases_and_repositories_respect_layer_boundaries() -> None:
    violations = []
    for path in APP.rglob("*.py"):
        module = path.relative_to(APP).with_suffix("")
        if "usecases" in module.parts:
            forbidden = HTTP | {"usecases", "sqlalchemy"}
        elif REPOSITORIES.intersection(module.parts):
            forbidden = HTTP | REPOSITORIES | {"usecases"}
        else:
            continue

        for name in imported_names(path):
            if forbidden.intersection(name.split(".")):
                violations.append(f"{module} -> {name}")

    assert not violations, "\n".join(sorted(violations))
