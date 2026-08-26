from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ReportItem(BaseModel):
    """Bir rapordaki tek bir içerik (haber) öğesi."""
    title: str
    url: str
    content: str = ""
    score: Optional[float] = None
    source: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    user_id: int
    subscription_id: Optional[int] = None
    topic: str
    category: str
    results: List[ReportItem] = []
    created_at: datetime

    class Config:
        from_attributes = True


class PreviewRequest(BaseModel):
    """'Şimdi Getir' — kayıt yapmadan anlık rapor önizlemesi."""
    topic: str
    category: str = "General"


class PreviewResponse(BaseModel):
    topic: str
    category: str
    results: List[ReportItem] = []
