from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import StoreSetting
from app.schemas import StoreSettingsUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/api/settings", tags=["Settings"])

DEFAULT_SETTINGS = {
    "storeName": "Bhakthi Printings",
    "tagline": "Premium Devotional Acrylic Frames",
    "supportPhone": "+91 7373646180",
    "supportEmail": "bhakthiprintings@gmail.com",
    "shippingThreshold": 999.0,
    "standardShippingFee": 99.0,
    "address": "21 North Street, Vadamamandur, Kallakurichi District, Tamil Nadu – 605702, India",
}

@router.get("")
def get_store_settings(db: Session = Depends(get_db)):
    """Retrieve public store configuration and contact coordinates."""
    s = db.query(StoreSetting).first()
    if not s:
        return DEFAULT_SETTINGS
    return s.to_dict()

@router.put("/admin")
def update_store_settings(
    payload: StoreSettingsUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin update store settings."""
    s = db.query(StoreSetting).first()
    if not s:
        s = StoreSetting()
        db.add(s)

    if payload.storeName:
        s.store_name = payload.storeName
    if payload.tagline:
        s.tagline = payload.tagline
    if payload.supportPhone:
        s.support_phone = payload.supportPhone
    if payload.supportEmail:
        s.support_email = payload.supportEmail
    if payload.shippingThreshold is not None:
        s.shipping_threshold = payload.shippingThreshold
    if payload.standardShippingFee is not None:
        s.standard_shipping_fee = payload.standardShippingFee
    if payload.address:
        s.address = payload.address

    db.commit()
    db.refresh(s)
    return s.to_dict()

