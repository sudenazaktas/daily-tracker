from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.database import engine
from sqlalchemy import text
from app.models.subscription import Subscription
from app.database import Base
from app.api.subscriptions import router as subscriptions_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Daily Tracker API")

# CORS ayarları — frontend farklı bir portta çalışacağı için gerekli
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme aşamasında hepsine izin veriyoruz, production'da kısıtlanacak
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(subscriptions_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"database": "connected"}