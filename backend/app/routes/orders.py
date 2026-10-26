import datetime
import random
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order, OrderItem, Product, Coupon
from app.schemas import CreateOrderRequest, OrderStatusUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/api/orders", tags=["Orders"])

SHIPPING_THRESHOLD = 999.0
STANDARD_SHIPPING_FEE = 99.0

@router.post("", status_code=status.HTTP_201_CREATED)
def place_guest_order(
    payload: CreateOrderRequest,
    db: Session = Depends(get_db)
):
    """Guest checkout endpoint: Validates items, calculates totals, checks stock, stores order."""
    if not payload.items:
        raise HTTPException(status_code=400, detail="Your cart has no items.")

    # 1. Validate items and verify/calculate subtotal
    subtotal = 0.0
    order_items_to_create = []

    for item in payload.items:
        # Check stock if item.id exists
        if item.id:
            prod = db.query(Product).filter(Product.id == item.id).first()
            if prod:
                if prod.stock < item.qty:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Only {prod.stock} units available for '{prod.name}'."
                    )
                # Decrement stock
                prod.stock = max(0, prod.stock - item.qty)

        item_total = item.price * item.qty
        subtotal += item_total
        order_items_to_create.append(item)

    # 2. Calculate shipping
    shipping_fee = 0.0 if subtotal >= SHIPPING_THRESHOLD else STANDARD_SHIPPING_FEE
    discount_amount = 0.0

    # Coupon validation
    if payload.couponCode:
        code = payload.couponCode.upper().strip()
        db_coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()
        if db_coupon and subtotal >= db_coupon.min_order:
            if db_coupon.type == "percent":
                discount_amount = round(subtotal * (db_coupon.discount / 100.0), 2)
            else:
                discount_amount = min(subtotal, db_coupon.discount)
        elif code == "WELCOME10":
            discount_amount = round(subtotal * 0.10, 2)
        elif code == "DIWALI20" and subtotal >= 1000:
            discount_amount = round(subtotal * 0.20, 2)
        elif code == "FLAT100" and subtotal >= 799:
            discount_amount = 100.0

    total_amount = max(0.0, subtotal - discount_amount + shipping_fee)

    # 3. Generate Order ID: BKT-YEAR-RANDOM
    year = datetime.datetime.utcnow().year
    random_digits = random.randint(10000, 99999)
    order_id = f"BKT-{year}-{random_digits}"

    # 4. Create Order Record
    order = Order(
        id=order_id,
        customer_name=payload.address.name,
        customer_email=payload.address.email,
        customer_phone=payload.address.phone,
        line1=payload.address.line1,
        line2=payload.address.line2,
        city=payload.address.city,
        state=payload.address.state,
        pincode=payload.address.pincode,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        discount_amount=discount_amount,
        total_amount=total_amount,
        payment_method=payload.paymentMethod,
        payment_status="paid",
        order_status="processing",
        tracking_courier="Delhivery Express",
        tracking_number=f"DL{random.randint(100000000, 999999999)}IN",
        tracking_status="Processing Order",
    )
    db.add(order)
    db.flush()

    for item in order_items_to_create:
        db.add(OrderItem(
            order_id=order_id,
            product_id=item.id,
            product_name=item.name,
            selected_size=item.selectedSize or "12×16 in",
            selected_shape=item.selectedShape or "vertical",
            price=item.price,
            quantity=item.qty,
            thumbnail=item.thumbnail,
        ))

    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "message": "Order placed successfully! We are preparing your divine frames.",
        "order": order.to_dict()
    }

@router.get("/track/{order_id}")
def track_guest_order(order_id: str, db: Session = Depends(get_db)):
    """Public tracking endpoint allowing guest devotees to check shipment progress with Order ID."""
    order = db.query(Order).filter(Order.id == order_id.strip()).first()
    if not order:
        raise HTTPException(
            status_code=404,
            detail=f"Order '{order_id}' not found. Please verify the order reference number."
        )
    return order.to_dict()

# --- Protected Admin Endpoints ---
@router.get("/admin/all")
def list_admin_orders(
    status: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Retrieve all orders for administration."""
    query = db.query(Order)
    if status and status != "all":
        query = query.filter(Order.order_status == status)
    if q:
        search_term = f"%{q.lower().strip()}%"
        query = query.filter(
            (Order.id.ilike(search_term)) |
            (Order.customer_name.ilike(search_term)) |
            (Order.customer_phone.ilike(search_term)) |
            (Order.tracking_number.ilike(search_term))
        )
    orders = query.order_by(Order.created_at.desc()).all()
    return [o.to_dict() for o in orders]

@router.patch("/admin/{order_id}")
def update_admin_order(
    order_id: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Update order status and courier tracking info."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if payload.order_status:
        order.order_status = payload.order_status
    if payload.tracking_courier:
        order.tracking_courier = payload.tracking_courier
    if payload.tracking_number:
        order.tracking_number = payload.tracking_number
    if payload.tracking_status:
        order.tracking_status = payload.tracking_status

    db.commit()
    db.refresh(order)
    return order.to_dict()

@router.delete("/admin/{order_id}")
def delete_admin_order(
    order_id: str,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Delete an order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    db.delete(order)
    db.commit()
    return {"success": True, "message": f"Order '{order_id}' deleted."}
