from app.database import engine, Base
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS material VARCHAR(100) DEFAULT 'Premium Acrylic';"))
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS thickness VARCHAR(50) DEFAULT '5mm';"))
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS finish VARCHAR(100) DEFAULT 'Glossy UV Print';"))
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS room_json TEXT DEFAULT '[\"pooja-room\", \"living-room\"]';"))
        conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS shape VARCHAR(50) DEFAULT 'vertical';"))
        conn.commit()
        print("[+] Columns added successfully to Neon products table.")

    # Ensure all tables (including coupons, reviews, store_settings) exist
    Base.metadata.create_all(bind=engine)
    print("[+] Base.metadata.create_all executed.")

if __name__ == "__main__":
    migrate()

