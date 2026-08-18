from pydantic import BaseModel
from datetime import datetime


class SubscriptionCreate(BaseModel):
    topic: str


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    topic: str
    created_at: datetime

    class Config:
        from_attributes = True