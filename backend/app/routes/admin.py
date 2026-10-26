from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import AdminUser, Order, Product, ContactEnquiry, Coupon, Review
from app.schemas import AdminLoginRequest, AdminLoginResponse
from app.auth import verify_password, create_access_token, get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    """Authenticate administrator and issue JWT session token."""
    admin = db.query(AdminUser).filter(AdminUser.username == payload.username.strip()).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({"sub": admin.username, "role": admin.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": admin.username,
            "email": admin.email,
            "role": admin.role,
        },
    }


@router.get("/me")
def get_admin_profile(current_admin: AdminUser = Depends(get_current_admin)):
    """Return currently authenticated administrator profile."""
    return {
        "id": current_admin.id,
        "username": current_admin.username,
        "email": current_admin.email,
        "role": current_admin.role,
    }


@router.get("/stats")
def get_admin_dashboard_stats(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Return administrative analytics for dashboard metrics."""
    total_orders = db.query(Order).count()
    revenue_sum = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.payment_status == "paid")
        .scalar()
        or 0.0
    )
    total_products = db.query(Product).count()
    low_stock = db.query(Product).filter(Product.stock <= 5).count()
    pending_orders = (
        db.query(Order)
        .filter(Order.order_status.in_(["processing", "pending"]))
        .count()
    )
    total_enquiries = db.query(ContactEnquiry).count()
    total_coupons = db.query(Coupon).count()
    total_reviews = db.query(Review).count()

    recent_orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(6)
        .all()
    )

    return {
        "totalOrders": total_orders,
        "totalRevenue": round(revenue_sum, 2),
        "totalProducts": total_products,
        "lowStock": low_stock,
        "pendingOrders": pending_orders,
        "totalEnquiries": total_enquiries,
        "totalCoupons": total_coupons,
        "totalReviews": total_reviews,
        "recentOrders": [o.to_dict() for o in recent_orders],
    }


@router.get("/enquiries")
def get_contact_enquiries(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Retrieve all customer contact submissions."""
    enquiries = (
        db.query(ContactEnquiry)
        .order_by(ContactEnquiry.created_at.desc())
        .limit(100)
        .all()
    )
    return [e.to_dict() for e in enquiries]


@router.delete("/enquiries/{enquiry_id}")
def delete_contact_enquiry(
    enquiry_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Delete a contact enquiry."""
    enquiry = db.query(ContactEnquiry).filter(ContactEnquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    db.delete(enquiry)
    db.commit()
    return {"success": True, "message": "Enquiry deleted successfully."}

