import logging
from sqlalchemy import text
from app.database import engine

logger = logging.getLogger("daily_tracker.migrations")


def ensure_schema():
    """
    Alembic kullanmadığımız için, mevcut tablolara sonradan eklenen kolonları
    idempotent (tekrar çalıştırılabilir) şekilde ekler.
    Base.metadata.create_all yalnızca eksik TABLOLARI oluşturur; var olan bir
    tabloya KOLON eklemez. Postgres'in 'ADD COLUMN IF NOT EXISTS' özelliği bunu güvenli kılar.
    """
    statements = [
        "ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS frequency VARCHAR NOT NULL DEFAULT 'daily'",
        "ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS last_sent_at TIMESTAMPTZ",
    ]

    with engine.begin() as conn:
        for stmt in statements:
            conn.execute(text(stmt))

    logger.info("Şema kontrolü tamamlandı (subscriptions kolonları güncel).")
