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


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    topic = Column(String, nullable=False)
    category = Column(Enum(Category, values_callable=lambda x: [e.value for e in x]), nullable=False, default=Category.general)
    created_at = Column(DateTime(timezone=True), server_default=func.now())