#!/usr/bin/env python3
"""
CLI utility to create or reset an Admin account for Bhakthi Printings.
Usage:
    python create_admin.py [username] [password] [email]
"""

import sys
from app.database import SessionLocal, engine, Base
from app.models import AdminUser
from app.auth import hash_password

def create_admin(username="admin", password="password123", email="bhakthiprintings@gmail.com"):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user = db.query(AdminUser).filter(AdminUser.username == username).first()
        if user:
            user.hashed_password = hash_password(password)
            user.email = email
            db.commit()
            print(f"[*] Admin user '{username}' password successfully updated.")
        else:
            new_admin = AdminUser(
                username=username,
                email=email,
                hashed_password=hash_password(password),
                role="admin"
            )
            db.add(new_admin)
            db.commit()
            print(f"[+] Admin user '{username}' created successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    u = sys.argv[1] if len(sys.argv) > 1 else "admin"
    p = sys.argv[2] if len(sys.argv) > 2 else "admin123"
    e = sys.argv[3] if len(sys.argv) > 3 else "bhakthiprintings@gmail.com"
    create_admin(u, p, e)

