import datetime
import json
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="admin", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    icon = Column(String(20), default="🕉️")
    description = Column(Text, nullable=True)
    count = Column(Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "name": self.name,
            "icon": self.icon,
            "description": self.description,
            "count": self.count,
        }

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    deity = Column(String(150), nullable=False, index=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    category_slug = Column(String(100), nullable=False, index=True)
    price = Column(Float, nullable=False)
    mrp = Column(Float, nullable=False)
    discount = Column(Integer, default=0)
    stock = Column(Integer, default=25)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    thumbnail = Column(String(500), nullable=False)
    images_json = Column(Text, default="[]")
    sizes_json = Column(Text, default="[]")
    shapes_json = Column(Text, default="[]")
    material = Column(String(100), default="Premium Acrylic")
    thickness = Column(String(50), default="5mm")
    finish = Column(String(100), default="Glossy UV Print")
    room_json = Column(Text, default='["pooja-room", "living-room"]')
    shape = Column(String(50), default="vertical")
    description = Column(Text, nullable=True)
    features_json = Column(Text, default="[]")
    is_featured = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=24)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        try:
            images = json.loads(self.images_json) if self.images_json else [self.thumbnail]
        except Exception:
            images = [self.thumbnail]
        try:
            sizes = json.loads(self.sizes_json) if self.sizes_json else []
        except Exception:
            sizes = []
        try:
            shapes = json.loads(self.shapes_json) if self.shapes_json else []
        except Exception:
            shapes = []
        try:
            features = json.loads(self.features_json) if self.features_json else []
        except Exception:
            features = []
        try:
            rooms = json.loads(self.room_json) if self.room_json else ["pooja-room", "living-room"]
        except Exception:
            rooms = ["pooja-room", "living-room"]

        return {
            "id": self.id,
            "name": self.name,
            "deity": self.deity,
            "slug": self.slug,
            "category": self.category_slug,
            "price": self.price,
            "mrp": self.mrp,
            "discount": self.discount,
            "stock": self.stock,
            "sku": self.sku,
            "thumbnail": self.thumbnail,
            "images": images,
            "sizes": sizes,
            "shapes": shapes,
            "material": self.material or "Premium Acrylic",
            "thickness": self.thickness or "5mm",
            "finish": self.finish or "Glossy UV Print",
            "room": rooms,
            "shape": self.shape or "vertical",
            "description": self.description,
            "features": features,
            "isFeatured": self.is_featured,
            "isBestseller": self.is_bestseller,
            "isNewArrival": self.is_new_arrival,
            "isActive": self.is_active,
            "rating": self.rating,
            "reviewCount": self.review_count,
        }

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True) # e.g. BKT-2026-0001
    customer_name = Column(String(150), nullable=False)
    customer_email = Column(String(150), nullable=False)
    customer_phone = Column(String(50), nullable=False, index=True)
    line1 = Column(String(255), nullable=False)
    line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)
    
    subtotal = Column(Float, nullable=False)
    shipping_fee = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    payment_method = Column(String(50), default="upi")
    payment_status = Column(String(50), default="paid") # paid, pending
    order_status = Column(String(50), default="processing") # processing, shipped, delivered, cancelled
    
    tracking_courier = Column(String(100), default="Delhivery Express")
    tracking_number = Column(String(100), nullable=True)
    tracking_status = Column(String(100), default="Processing")
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.created_at.strftime("%Y-%m-%d"),
            "status": self.order_status,
            "paymentStatus": self.payment_status,
            "paymentMethod": self.payment_method,
            "subtotal": self.subtotal,
            "shipping": self.shipping_fee,
            "discount": self.discount_amount,
            "total": self.total_amount,
            "address": {
                "name": self.customer_name,
                "email": self.customer_email,
                "phone": self.customer_phone,
                "line1": self.line1,
                "line2": self.line2 or "",
                "city": self.city,
                "state": self.state,
                "pincode": self.pincode,
            },
            "tracking": {
                "courier": self.tracking_courier or "Delhivery Express",
                "trackingNo": self.tracking_number or f"TRK-{self.id}",
                "status": self.tracking_status or self.order_status.capitalize(),
                "updatedAt": self.created_at.strftime("%Y-%m-%d"),
            } if self.tracking_number else None,
            "items": [item.to_dict() for item in self.items]
        }

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, nullable=True)
    product_name = Column(String(200), nullable=False)
    selected_size = Column(String(50), default="12×16 in")
    selected_shape = Column(String(50), default="vertical")
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    thumbnail = Column(String(500), nullable=True)

    order = relationship("Order", back_populates="items")

    def to_dict(self):
        return {
            "id": self.product_id,
            "name": self.product_name,
            "selectedSize": self.selected_size,
            "selectedShape": self.selected_shape,
            "price": self.price,
            "qty": self.quantity,
            "thumbnail": self.thumbnail,
        }

class ContactEnquiry(Base):
    __tablename__ = "contact_enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=True)
    subject = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    email_sent = Column(Boolean, default=False)
    email_error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone or "",
            "subject": self.subject,
            "message": self.message,
            "emailSent": self.email_sent,
            "emailError": self.email_error,
            "date": self.created_at.strftime("%Y-%m-%d %H:%M"),
        }

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount = Column(Float, nullable=False) # e.g. 10 (%) or 100 (flat)
    type = Column(String(20), default="percent") # percent | flat
    min_order = Column(Float, default=500.0)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "discount": self.discount,
            "type": self.type,
            "minOrder": self.min_order,
            "description": self.description or "",
            "isActive": self.is_active,
        }

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    city = Column(String(100), nullable=True)
    rating = Column(Integer, default=5)
    text = Column(Text, nullable=False)
    product = Column(String(200), nullable=True)
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city or "",
            "rating": self.rating,
            "text": self.text,
            "product": self.product or "Bhakthi Divine Frame",
            "verified": self.verified,
            "date": self.created_at.strftime("%Y-%m-%d"),
        }

class StoreSetting(Base):
    __tablename__ = "store_settings"

    id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String(150), default="Bhakthi Printings")
    tagline = Column(String(255), default="Premium Devotional Acrylic Frames")
    support_phone = Column(String(50), default="+91 7373646180")
    support_email = Column(String(150), default="bhakthiprintings@gmail.com")
    shipping_threshold = Column(Float, default=999.0)
    standard_shipping_fee = Column(Float, default=99.0)
    address = Column(Text, default="21 North Street, Vadamamandur, Kallakurichi District, Tamil Nadu – 605702, India")

    def to_dict(self):
        return {
            "storeName": self.store_name,
            "tagline": self.tagline,
            "supportPhone": self.support_phone,
            "supportEmail": self.support_email,
            "shippingThreshold": self.shipping_threshold,
            "standardShippingFee": self.standard_shipping_fee,
            "address": self.address,
        }
