FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN groupadd --gid 10001 app \
    && useradd --uid 10001 --gid app --system --no-create-home app \
    && mkdir -p /app/media \
    && chown app:app /app/media

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY alembic.ini .
COPY migrations ./migrations
COPY app ./app

USER app

EXPOSE 8000

# Миграции накатываются при каждом старте: на свежей базе создадут схему, на живой — ничего не сделают.
CMD ["sh", "-c", "python -m alembic upgrade head && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers ${WEB_WORKERS:-3}"]
