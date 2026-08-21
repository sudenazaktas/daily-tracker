from fastapi import APIRouter, BackgroundTasks
from app.services.daily_job import run_daily_job

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/run-daily")
def trigger_daily_job(background_tasks: BackgroundTasks):
    """
    Günlük rapor akışını manuel olarak tetikler.
    API'nin hemen yanıt vermesi için görevi arka planda (background task) çalıştırır.
    """
    background_tasks.add_task(run_daily_job)
    return {"message": "Günlük rapor görevi arka planda başarıyla tetiklendi."}


@router.post("/run-daily-sync")
def trigger_daily_job_sync():
    """
    Günlük rapor akışını senkron olarak tetikler ve detaylı sonuçları döner.
    """
    result = run_daily_job()
    return {"message": "Günlük rapor görevi tamamlandı.", "details": result}
