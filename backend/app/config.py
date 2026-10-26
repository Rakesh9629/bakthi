import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Bhakthi Printings API"
    VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/bhakthi_db"
    )
    
    # JWT & Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bhakthi_printings_super_secret_jwt_key_2026_devotional")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Business Contacts
    BUSINESS_NAME: str = "Bhakthi Printings"
    BUSINESS_PHONE: str = "7373646180"
    BUSINESS_EMAIL: str = "bhakthiprintings@gmail.com"
    CONTACT_RECEIVER_EMAIL: str = os.getenv("CONTACT_RECEIVER_EMAIL", "bhakthiprintings@gmail.com")
    
    # SMTP Email Configuration
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "bhakthiprintings@gmail.com")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "True").lower() in ("true", "1", "t")
    SMTP_USE_SSL: bool = os.getenv("SMTP_USE_SSL", "False").lower() in ("true", "1", "t")

settings = Settings()

