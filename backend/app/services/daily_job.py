import logging
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import SessionLocal
from app.models.subscription import Subscription
from app.services.report_service import send_daily_report

logger = logging.getLogger("daily_tracker.daily_job")


def run_daily_job():
    """
    Tüm kullanıcı aboneliklerini çeker, Strapi up_users tablosundan hedef e-postayı bulur
    ve report_service aracılığıyla günlük rapor e-postalarını gönderir.
    """
    logger.info("Günlük rapor görevi başlatılıyor...")
    db: Session = SessionLocal()

    try:
        subscriptions = db.query(Subscription).all()
        logger.info(f"İşlenecek {len(subscriptions)} abonelik bulundu.")

        processed = 0
        failed = 0

        for sub in subscriptions:
            # Strapi'nin up_users tablosundan kullanıcı e-postasını sorgula
            query = text("SELECT email FROM up_users WHERE id = :user_id")
            result = db.execute(query, {"user_id": sub.user_id}).first()

            if not result or not result[0]:
                logger.warning(f"user_id={sub.user_id} için e-posta bulunamadı (subscription_id={sub.id}). Atlanıyor.")
                continue

            to_email = result[0]
            category_val = sub.category.value if hasattr(sub.category, "value") else str(sub.category)

            logger.info(f"Rapor işleniyor: user_id={sub.user_id} ({to_email}), konu='{sub.topic}'...")

            try:
                send_daily_report(
                    to_email=to_email,
                    topic=sub.topic,
                    category=category_val,
                )
                processed += 1
            except Exception as e:
                logger.error(f"Rapor gönderilirken hata (sub_id={sub.id}, topic={sub.topic}): {e}")
                failed += 1

        logger.info(f"Günlük rapor görevi tamamlandı. Başarılı: {processed}, Başarısız: {failed}.")
        return {"subscriptions_found": len(subscriptions), "processed": processed, "failed": failed}

    finally:
        db.close()
