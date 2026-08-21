import logging
from apscheduler.schedulers.background import BackgroundScheduler
from app.services.daily_job import run_daily_job

logger = logging.getLogger("daily_tracker.scheduler")

scheduler = BackgroundScheduler()


def start_scheduler():
    """APScheduler'ı günlük görev zamanlamasıyla başlatır."""
    if not scheduler.running:
        # Her gün UTC 09:00'da çalışacak şekilde zamanla
        scheduler.add_job(
            func=run_daily_job,
            trigger="cron",
            hour=9,
            minute=0,
            id="daily_digest_job",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("APScheduler başarıyla başlatıldı. daily_digest_job UTC 09:00'a zamanlandı.")


def stop_scheduler():
    """APScheduler'ı güvenli şekilde durdurur."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("APScheduler durduruldu.")
