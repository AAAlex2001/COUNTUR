from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.admin import routes as admin_auth
from app.cart import routes as cart
from app.catalog import admin_routes as admin_catalog
from app.catalog import routes as catalog
from app.collections import admin_routes as admin_collections
from app.collections import routes as collections
from app.config import MEDIA_URL, get_settings
from app.favorites import routes as favorites
from app.feedback import admin_routes as admin_feedback
from app.feedback import routes as feedback
from app.landing import admin_routes as admin_landing
from app.landing import routes as landing
from app.orders import admin_routes as admin_orders
from app.orders import routes as orders
from app.users import admin_routes as admin_users
from app.users import routes as users

settings = get_settings()

app = FastAPI(
    title="COUNTUR API",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["service"])
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(catalog.router, prefix="/api/v1")
app.include_router(collections.router, prefix="/api/v1")
app.include_router(cart.router, prefix="/api/v1")
app.include_router(favorites.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(landing.router, prefix="/api/v1")
app.include_router(feedback.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(admin_auth.router, prefix="/api/v1")
app.include_router(admin_catalog.router, prefix="/api/v1")
app.include_router(admin_collections.router, prefix="/api/v1")
app.include_router(admin_orders.router, prefix="/api/v1")
app.include_router(admin_landing.router, prefix="/api/v1")
app.include_router(admin_feedback.router, prefix="/api/v1")
app.include_router(admin_users.router, prefix="/api/v1")

Path(settings.media_dir).mkdir(parents=True, exist_ok=True)
app.mount(MEDIA_URL, StaticFiles(directory=settings.media_dir), name="media")
