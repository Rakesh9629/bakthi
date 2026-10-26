from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Coupon
from app.schemas import CouponCreate, CouponValidateRequest, CouponValidateResponse
from app.auth import get_current_admin

router = APIRouter(prefix="/api/coupons", tags=["Coupons"])

@router.get("")
def list_coupons(db: Session = Depends(get_db)):
    """Retrieve all active coupons."""
    coupons = db.query(Coupon).filter(Coupon.is_active == True).all()
    return [c.to_dict() for c in coupons]

@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon(payload: CouponValidateRequest, db: Session = Depends(get_db)):
    """Validate a promo coupon for cart checkout."""
    code = payload.code.upper().strip()
    coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()

    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid coupon code.")

    if payload.subtotal < coupon.min_order:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum order of ₹{coupon.min_order:.0f} required for coupon {code}."
        )

    if coupon.type == "percent":
        discount_amount = round(payload.subtotal * (coupon.discount / 100.0), 2)
    else:
        discount_amount = min(payload.subtotal, coupon.discount)

    return {
        "valid": True,
        "code": coupon.code,
        "discount": coupon.discount,
        "type": coupon.type,
        "discountAmount": discount_amount,
        "message": f"Coupon {coupon.code} applied successfully! You saved ₹{discount_amount}."
    }

@router.post("/admin", status_code=status.HTTP_201_CREATED)
def create_coupon(
    payload: CouponCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin create promotional coupon."""
    code = payload.code.upper().strip()
    existing = db.query(Coupon).filter(Coupon.code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists.")

    coupon = Coupon(
        code=code,
        discount=payload.discount,
        type=payload.type,
        min_order=payload.minOrder,
        description=payload.description or "",
        is_active=True
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon.to_dict()

@router.delete("/admin/{code}")
def delete_coupon(
    code: str,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin delete promotional coupon."""
    coupon = db.query(Coupon).filter(Coupon.code == code.upper().strip()).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")
    db.delete(coupon)
    db.commit()
    return {"success": True, "message": f"Coupon {code} deleted."}

