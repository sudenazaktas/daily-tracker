from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.subscriptions import router as subscriptions_router
from app.api.jobs import router as jobs_router
from app.database import engine, Base
from app.models.subscription import Subscription
from app.core.scheduler import start_scheduler, stop_scheduler
from sqlalchemy import text


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="Daily Tracker API", lifespan=lifespan)

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
app.include_router(jobs_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"database": "connected"}