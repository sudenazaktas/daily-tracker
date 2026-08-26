from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user_id
from app.models.subscription import Subscription
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
    SubscriptionResponse,
)
from typing import List

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("", response_model=SubscriptionResponse)
def create_subscription(
    payload: SubscriptionCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    new_sub = Subscription(
        user_id=user_id,
        topic=payload.topic,
        category=payload.category,
        frequency=payload.frequency.value,
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub


@router.patch("/{subscription_id}", response_model=SubscriptionResponse)
def update_subscription(
    subscription_id: int,
    payload: SubscriptionUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    sub = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == user_id,
    ).first()

    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    if payload.topic is not None:
        sub.topic = payload.topic
    if payload.category is not None:
        sub.category = payload.category
    if payload.frequency is not None:
        sub.frequency = payload.frequency.value

    db.commit()
    db.refresh(sub)
    return sub


@router.get("", response_model=List[SubscriptionResponse])
def list_subscriptions(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return db.query(Subscription).filter(Subscription.user_id == user_id).all()


@router.delete("/{subscription_id}")
def delete_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    sub = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == user_id,
    ).first()

    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    db.delete(sub)
    db.commit()
    return {"message": "Subscription deleted"}