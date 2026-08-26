from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.core.security import get_current_user_id
from app.models.report import Report
from app.schemas.report import ReportResponse, PreviewRequest, PreviewResponse
from app.services.report_service import generate_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=List[ReportResponse])
def list_reports(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Giriş yapan kullanıcının geçmiş raporları (en yeniden eskiye)."""
    return (
        db.query(Report)
        .filter(Report.user_id == user_id)
        .order_by(Report.created_at.desc())
        .limit(limit)
        .all()
    )


@router.post("/preview", response_model=PreviewResponse)
def preview_report(
    payload: PreviewRequest,
    user_id: int = Depends(get_current_user_id),
):
    """
    'Şimdi Getir' — bir konu için anlık arama+sıralama yapar, sonuçları döner.
    Veritabanına kayıt YAPMAZ, e-posta GÖNDERMEZ; sadece önizleme amaçlıdır.
    """
    results = generate_report(topic=payload.topic, category=payload.category)
    return PreviewResponse(topic=payload.topic, category=payload.category, results=results)
