# Бот поддержки Countur

Код бота находится в `support-bot/app`, зависимости — в `support-bot/requirements.txt`. Docker Compose собирает образ из `support-bot/Dockerfile` и запускает отдельный сервис `support-bot` в режиме long polling. Таблица `telegram_replies` находится в общей PostgreSQL. Её создаёт миграция Alembic `0017` при запуске бэкенда.

## Запуск

В общем файле `.env` рядом с `docker-compose.yml` задайте `TELEGRAM_BOT_TOKEN` и `ADMIN_CHAT_ID`. При первой настройке скопируйте корневой `.env.example` в `.env`. Compose передаёт боту подключение к базе из настроек сайта. Чтобы бот обновлялся вместе с сайтом при обычном деплое, добавьте в `.env` строку `COMPOSE_PROFILES=support`. Для запуска только бота и его зависимостей выполните из корня проекта:

```sh
docker compose up -d --build support-bot
```

## Перенос открытых заявок

Если покупатели уже писали в прежнюю версию бота, остановите её и укажите абсолютный путь к её файлу базы на машине с Docker. Архив должен содержать таблицу `pending_replies`. После сборки образа запустите:

```sh
docker compose run --rm \
  --volume "/path/to/support_requests.sqlite3:/old/support_requests.sqlite3:ro" \
  support-bot python -m scripts.import_telegram_replies /old/support_requests.sqlite3
```

Импорт сохраняет номера заявок из кнопок «Ответить». Файл открывается для чтения. Повторный запуск пропускает ранее перенесённые и закрытые заявки.
