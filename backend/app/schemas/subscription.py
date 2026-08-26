from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.subscription import Category, Frequency


class SubscriptionCreate(BaseModel):
    topic: str
    category: Category = Category.general
    frequency: Frequency = Frequency.daily


class SubscriptionUpdate(BaseModel):
    """Aboneliğin kısmen güncellenmesi (örn. sadece sıklık değişimi)."""
    topic: Optional[str] = None
    category: Optional[Category] = None
    frequency: Optional[Frequency] = None


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    topic: str
    category: Category
    frequency: Frequency
    last_sent_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
