import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import SessionLocal
from app.models.subscription import Subscription, FREQUENCY_INTERVAL_DAYS
from app.models.report import Report
from app.services.report_service import generate_report, send_report_email

logger = logging.getLogger("daily_tracker.daily_job")


def _is_due(sub: Subscription, now: datetime) -> bool:
    """Aboneliğin sıklığına ve son gönderim zamanına göre bugün gönderilmeli mi?"""
    if sub.last_sent_at is None:
        return True
    interval_days = FREQUENCY_INTERVAL_DAYS.get(sub.frequency, 1)
    # last_sent_at timezone-aware (timestamptz) gelir; olası naive değere karşı koru.
    last = sub.last_sent_at
    if last.tzinfo is None:
        last = last.replace(tzinfo=timezone.utc)
    return (now - last) >= timedelta(days=interval_days)


def run_daily_job():
    """
    Görev her gün çalışır. Her abonelik için sıklık kontrolü yapar; zamanı gelenler için
    Strapi up_users tablosundan e-postayı bulur, raporu üretir, veritabanına kaydeder ve gönderir.
    """
    logger.info("Günlük rapor görevi başlatılıyor...")
    now = datetime.now(timezone.utc)
    db: Session = SessionLocal()

    try:
        subscriptions = db.query(Subscription).all()
        logger.info(f"Toplam {len(subscriptions)} abonelik bulundu.")

        processed = 0
        skipped = 0
        failed = 0

        for sub in subscriptions:
            if not _is_due(sub, now):
                skipped += 1
                continue

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
                results = generate_report(topic=sub.topic, category=category_val)

                if not results:
                    logger.info(f"'{sub.topic}' için sonuç bulunamadı, atlanıyor.")
                    continue

                # Geçmiş için kaydet
                report = Report(
                    user_id=sub.user_id,
                    subscription_id=sub.id,
                    topic=sub.topic,
                    category=category_val,
                    results=results,
                )
                db.add(report)

                # E-postayı gönder ve son gönderim zamanını güncelle
                send_report_email(to_email=to_email, topic=sub.topic, results=results)
                sub.last_sent_at = now
                db.commit()
                processed += 1
            except Exception as e:
                db.rollback()
                logger.error(f"Rapor gönderilirken hata (sub_id={sub.id}, topic={sub.topic}): {e}")
                failed += 1

        logger.info(
            f"Günlük rapor görevi tamamlandı. Gönderilen: {processed}, Zamanı gelmeyen: {skipped}, Başarısız: {failed}."
        )
        return {
            "subscriptions_found": len(subscriptions),
            "processed": processed,
            "skipped": skipped,
            "failed": failed,
        }

    finally:
        db.close()
