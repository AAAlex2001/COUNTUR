"""Создание администратора из консоли: python -m app.admin.cli <логин>."""

import argparse
import asyncio
import sys
from getpass import getpass

from app.admin.services.exceptions import AdminAlreadyExistsError, WeakPasswordError
from app.admin.services.repo import AdminRepository
from app.admin.services.usecases.create_admin import CreateAdminUseCase
from app.database import SessionLocal, engine


async def create_admin(login: str, password: str) -> None:
    """Создать администратора в базе из настроек окружения."""

    async with SessionLocal() as session:
        usecase = CreateAdminUseCase(AdminRepository(session))
        admin = await usecase.execute(login, password)

    await engine.dispose()

    print(f"Администратор «{admin.login}» создан")


def main() -> None:
    """Прочитать логин из аргументов, пароль — с клавиатуры, и создать администратора."""

    parser = argparse.ArgumentParser(description="Создать администратора магазина")
    parser.add_argument("login", help="Логин администратора")
    arguments = parser.parse_args()

    password = getpass("Пароль: ")
    if password != getpass("Пароль ещё раз: "):
        sys.exit("Пароли не совпадают")

    try:
        asyncio.run(create_admin(arguments.login, password))
    except WeakPasswordError as error:
        sys.exit(str(error))
    except AdminAlreadyExistsError:
        sys.exit("Администратор с таким логином уже есть")


if __name__ == "__main__":
    main()
