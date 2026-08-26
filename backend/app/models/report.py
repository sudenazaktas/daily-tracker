from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class Report(Base):
    """
    Gönderilmiş bir günlük raporun kalıcı kaydı.
    'results' alanı, o rapordaki içeriklerin normalize edilmiş listesini tutar:
    [{ "title", "url", "content", "score", "source" }, ...]
    """
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    subscription_id = Column(Integer, nullable=True, index=True)
    topic = Column(String, nullable=False)
    category = Column(String, nullable=False, default="General")
    results = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
