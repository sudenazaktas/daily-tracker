import enum
from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base


class Category(str, enum.Enum):
    technology = "Technology"
    business_finance = "Business & Finance"
    science = "Science"
    sports = "Sports"
    entertainment = "Entertainment"
    politics = "Politics"
    health = "Health"
    general = "General"


class Frequency(str, enum.Enum):
    """Rapor gönderim sıklığı. Değerler daily_job'daki gün aralığına eşlenir."""
    daily = "daily"            # her gün (24 saatte bir)
    every_3_days = "every_3_days"  # 3 günde bir
    weekly = "weekly"          # haftalık (7 günde bir)


# Sıklık değeri -> gün cinsinden minimum aralık
FREQUENCY_INTERVAL_DAYS = {
    Frequency.daily.value: 1,
    Frequency.every_3_days.value: 3,
    Frequency.weekly.value: 7,
}


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    topic = Column(String, nullable=False)
    category = Column(Enum(Category, values_callable=lambda x: [e.value for e in x]), nullable=False, default=Category.general)
    # Sıklık, Postgres enum tipi karmaşasını önlemek için düz String olarak tutulur;
    # doğrulama Pydantic tarafında Frequency enum'u ile yapılır.
    frequency = Column(String, nullable=False, server_default=Frequency.daily.value, default=Frequency.daily.value)
    # Bu abonelik için raporun en son gönderildiği an (sıklık kontrolü için).
    last_sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
