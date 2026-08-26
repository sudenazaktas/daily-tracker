import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.subscriptions import router as subscriptions_router
from app.api.jobs import router as jobs_router
from app.api.reports import router as reports_router
from app.database import engine, Base
from app.models.subscription import Subscription
from app.models.report import Report
from app.core.scheduler import start_scheduler, stop_scheduler
from app.core.migrations import ensure_schema
from sqlalchemy import text


# Zamanlayıcı üretimde (uyuyan ücretsiz sunucularda) güvenilir çalışmadığı için
# ENABLE_SCHEDULER=false ile kapatılıp yerine dış cron (GitHub Actions) kullanılabilir.
ENABLE_SCHEDULER = os.getenv("ENABLE_SCHEDULER", "true").lower() == "true"


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_schema()
    if ENABLE_SCHEDULER:
        start_scheduler()
    yield
    if ENABLE_SCHEDULER:
        stop_scheduler()


app = FastAPI(title="Daily Tracker API", lifespan=lifespan)

# CORS — izin verilen origin'ler ALLOWED_ORIGINS env'inden (virgülle ayrık) okunur.
# Tanımsızsa geliştirme kolaylığı için hepsine izin verilir.
_origins_env = os.getenv("ALLOWED_ORIGINS", "").strip()
allowed_origins = [o.strip() for o in _origins_env.split(",") if o.strip()] or ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(subscriptions_router)
app.include_router(jobs_router)
app.include_router(reports_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"database": "connected"}