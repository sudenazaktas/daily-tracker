from pydantic import BaseModel
from datetime import datetime
from app.models.subscription import Category


class SubscriptionCreate(BaseModel):
    topic: str
    category: Category = Category.general


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    topic: str
    category: Category
    created_at: datetime

    class Config:
        from_attributes = True