import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

# Primary database engine
try:
    # Ensure psycopg2 driver is explicitly used for postgresql:// URLs
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=300,
    )
    # Test connection
    with engine.connect() as conn:
        logger.info("Successfully connected to primary database (PostgreSQL).")
except Exception as e:
    logger.warning(
        f"Could not connect to PostgreSQL at {settings.DATABASE_URL}: {e}. "
        "Falling back to local SQLite database (bhakthi.db) for resilience."
    )
    # Fallback to local SQLite so backend never fails to start
    engine = create_engine(
        "sqlite:///./bhakthi.db",
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

