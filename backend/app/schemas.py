import re
from typing import List, Optional, Any
from pydantic import BaseModel, Field, field_validator

# --- Contact Form Schemas ---
class ContactFormRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    phone: Optional[str] = Field(None, max_length=50)
    subject: str = Field("General Inquiry", min_length=2, max_length=150)
    message: str = Field(..., min_length=10, max_length=3000)

    @field_validator("name", "subject", "email")
    @classmethod
    def prevent_header_injection(cls, v: str) -> str:
        # Prevent CRLF / email header injection attacks
        cleaned = re.sub(r"[\r\n]", " ", v).strip()
        return cleaned

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        pattern = r"^[\w\.\+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$"
        if not re.match(pattern, v):
            raise ValueError("Please provide a valid email address.")
        return v

class ContactFormResponse(BaseModel):
    success: bool
    message: str
    enquiry_id: Optional[int] = None
    email_delivered: bool = False

# --- Guest Checkout Schemas ---
class GuestAddressSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: str = Field(..., min_length=5, max_length=150)
    phone: str = Field(..., min_length=10, max_length=20)
    line1: str = Field(..., min_length=3, max_length=255)
    line2: Optional[str] = Field(None, max_length=255)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    pincode: str = Field(..., min_length=4, max_length=10)

class OrderItemSchema(BaseModel):
    id: Optional[int] = None
    name: str
    selectedSize: Optional[str] = "12×16 in"
    selectedShape: Optional[str] = "vertical"
    price: float
    qty: int = 1
    thumbnail: Optional[str] = None

class CreateOrderRequest(BaseModel):
    address: GuestAddressSchema
    items: List[OrderItemSchema]
    paymentMethod: str = "upi"
    couponCode: Optional[str] = None

# --- Admin Authentication Schemas ---
class AdminLoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=4, max_length=100)

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# --- Admin Product Schemas ---
class ProductCreateUpdate(BaseModel):
    name: str
    deity: str
    category: str
    price: float
    mrp: float
    stock: int = 25
    thumbnail: Optional[str] = None
    images: Optional[List[str]] = []
    sizes: Optional[List[Any]] = []
    shapes: Optional[List[str]] = []
    material: Optional[str] = "Premium Acrylic"
    thickness: Optional[str] = "5mm"
    finish: Optional[str] = "Glossy UV Print"
    room: Optional[List[str]] = ["pooja-room", "living-room"]
    shape: Optional[str] = "vertical"
    description: Optional[str] = None
    features: Optional[List[str]] = []
    isFeatured: Optional[bool] = False
    isBestseller: Optional[bool] = False
    isNewArrival: Optional[bool] = True
    isActive: Optional[bool] = True

class OrderStatusUpdate(BaseModel):
    order_status: Optional[str] = None
    tracking_courier: Optional[str] = None
    tracking_number: Optional[str] = None
    tracking_status: Optional[str] = None

# --- Coupon Schemas ---
class CouponCreate(BaseModel):
    code: str = Field(..., min_length=2, max_length=50)
    discount: float = Field(..., gt=0)
    type: str = "percent" # percent | flat
    minOrder: float = Field(500.0, ge=0)
    description: Optional[str] = ""

class CouponValidateRequest(BaseModel):
    code: str
    subtotal: float

class CouponValidateResponse(BaseModel):
    valid: bool
    code: str
    discount: float
    type: str
    discountAmount: float
    message: str

# --- Review Schemas ---
class ReviewCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    city: Optional[str] = None
    rating: int = Field(5, ge=1, le=5)
    text: str = Field(..., min_length=5, max_length=2000)
    product: Optional[str] = "Bhakthi Divine Frame"

# --- Category Schemas ---
class CategoryCreateUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    slug: Optional[str] = None
    icon: Optional[str] = "🕉️"
    description: Optional[str] = ""

# --- Store Settings Schemas ---
class StoreSettingsUpdate(BaseModel):
    storeName: Optional[str] = "Bhakthi Printings"
    tagline: Optional[str] = "Premium Devotional Acrylic Frames"
    supportPhone: Optional[str] = "+91 7373646180"
    supportEmail: Optional[str] = "bhakthiprintings@gmail.com"
    shippingThreshold: Optional[float] = 999.0
    standardShippingFee: Optional[float] = 99.0
    address: Optional[str] = "21 North Street, Vadamamandur, Kallakurichi District, Tamil Nadu – 605702, India"
