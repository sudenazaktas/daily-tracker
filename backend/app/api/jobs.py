import os
import jwt
from fastapi import APIRouter, BackgroundTasks, Header, HTTPException
from app.services.daily_job import run_daily_job

router = APIRouter(prefix="/jobs", tags=["jobs"])

JOB_SECRET = os.getenv("JOB_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET")


def _has_valid_jwt(authorization: str | None) -> bool:
    if not authorization or not authorization.startswith("Bearer "):
        return False
    try:
        jwt.decode(authorization[7:], JWT_SECRET, algorithms=["HS256"])
        return True
    except Exception:
        return False


def verify_access(x_job_secret: str | None, authorization: str | None):
    """
    JOB_SECRET tanımlıysa (üretim), erişim ancak şu iki durumda verilir:
      - X-Job-Secret başlığı JOB_SECRET ile eşleşiyorsa (dış cron), veya
      - Geçerli bir kullanıcı JWT'si varsa (frontend'deki manuel tetikleme).
    JOB_SECRET tanımsızsa (yerel geliştirme) kontrol atlanır.
    """
    if not JOB_SECRET:
        return
    if x_job_secret == JOB_SECRET:
        return
    if _has_valid_jwt(authorization):
        return
    raise HTTPException(status_code=401, detail="Bu görevi tetiklemek için yetkiniz yok.")


@router.post("/run-daily")
def trigger_daily_job(
    background_tasks: BackgroundTasks,
    x_job_secret: str | None = Header(default=None),
    authorization: str | None = Header(default=None),
):
    """
    Günlük rapor akışını tetikler (dış cron veya giriş yapmış kullanıcı).
    API'nin hemen yanıt vermesi için görevi arka planda çalıştırır.
    """
    verify_access(x_job_secret, authorization)
    background_tasks.add_task(run_daily_job)
    return {"message": "Günlük rapor görevi arka planda başarıyla tetiklendi."}


@router.post("/run-daily-sync")
def trigger_daily_job_sync(
    x_job_secret: str | None = Header(default=None),
    authorization: str | None = Header(default=None),
):
    """Günlük rapor akışını senkron çalıştırır ve sonucu döner (test/cron için)."""
    verify_access(x_job_secret, authorization)
    result = run_daily_job()
    return {"message": "Günlük rapor görevi tamamlandı.", "details": result}
