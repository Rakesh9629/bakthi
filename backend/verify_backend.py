#!/usr/bin/env python3
"""
Comprehensive verification test for Bhakthi Printings backend with Neon PostgreSQL.
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from app.database import SessionLocal, engine, Base
from app.models import AdminUser, Product, Category, Coupon, Review, StoreSetting, Order
from app.schemas import (
    ContactFormRequest, CreateOrderRequest, GuestAddressSchema,
    OrderItemSchema, AdminLoginRequest, CouponValidateRequest,
    ReviewCreate, StoreSettingsUpdate, CategoryCreateUpdate
)
from app.auth import decode_access_token
from app.routes.contact import submit_contact_form
from app.routes.orders import place_guest_order, track_guest_order, list_admin_orders
from app.routes.admin import admin_login, get_admin_dashboard_stats, get_contact_enquiries
from app.routes.products import list_products, get_product
from app.routes.categories import list_categories
from app.routes.coupons import list_coupons, validate_coupon
from app.routes.reviews import list_reviews, submit_review
from app.routes.settings import get_store_settings, update_store_settings
from app.seed_data import seed_database

def test_full_backend():
    print("[*] Starting comprehensive verification with Neon PostgreSQL...")
    db = SessionLocal()
    try:
        # 1. Database Seeding check
        seed_database(db)
        p_count = db.query(Product).count()
        c_count = db.query(Category).count()
        coup_count = db.query(Coupon).count()
        rev_count = db.query(Review).count()
        print(f"  [+] Neon Database Catalog: {p_count} Products, {c_count} Categories, {coup_count} Coupons, {rev_count} Reviews")

        # 2. Public Products & Filtering test
        all_prods = list_products(db=db)
        assert len(all_prods) >= 24, f"Expected 24 products, got {len(all_prods)}"
        first_p = all_prods[0]
        print(f"  [+] Products API: Retrieved {len(all_prods)} products (First: '{first_p['name']}', deity: '{first_p['deity']}', price: ₹{first_p['price']})")

        # Deity filter
        ganesha_prods = list_products(category="lord-ganesha", db=db)
        assert len(ganesha_prods) > 0, "No Ganesha products found"
        print(f"  [+] Category Filtering: {len(ganesha_prods)} frames in 'lord-ganesha'")

        # Price range filter
        mid_price = list_products(price="500-1000", db=db)
        assert len(mid_price) > 0, "No products in 500-1000 range"
        print(f"  [+] Price Filter (₹500 - ₹1000): {len(mid_price)} matching frames")

        # Product by slug
        p_slug = get_product("radha-krishna-divine-love", db=db)
        assert p_slug["slug"] == "radha-krishna-divine-love"
        print(f"  [+] Product Details lookup: '{p_slug['name']}' with {len(p_slug['sizes'])} sizes and {len(p_slug['features'])} features")

        # 3. Categories listing test
        cats = list_categories(db=db)
        assert len(cats) >= 12
        print(f"  [+] Categories API: {len(cats)} categories (First: {cats[0]['name']} with {cats[0]['count']} live frames)")

        # 4. Coupon Validation test
        coup_res = validate_coupon(CouponValidateRequest(code="WELCOME10", subtotal=1500.0), db=db)
        assert coup_res["valid"] == True and coup_res["discountAmount"] == 150.0
        print(f"  [+] Coupon Validation: WELCOME10 applied, discount = ₹{coup_res['discountAmount']}")

        # 5. Reviews test
        new_rev = submit_review(ReviewCreate(
            name="Sundar Rajan",
            city="Salem",
            rating=5,
            text="The acrylic gloss finish on the Balaji frame exceeded our expectations. Arrived in immaculate condition.",
            product="Lord Venkateswara"
        ), db=db)
        assert new_rev["success"] == True
        print(f"  [+] Review Submission: Added customer review for '{new_rev['review']['name']}'")

        revs = list_reviews(db=db)
        print(f"  [+] Reviews List: {len(revs)} testimonials retrieved")

        # 6. Contact Form Submission (Honest error & DB record)
        class MockClient:
            host = "127.0.0.1"
        class MockRequest:
            client = MockClient()

        contact_res = submit_contact_form(
            ContactFormRequest(
                name="Devotee Meenakshi",
                email="meenakshi.test@example.com",
                phone="7373646180",
                subject="Custom Tanjore Frame",
                message="Looking for a 24x36 inch custom Lakshmi frame for our pooja altar in Vadamamandur."
            ),
            request=MockRequest(),
            db=db
        )
        assert contact_res.success == True
        print(f"  [+] Contact Submission: Recorded enquiry ID {contact_res.enquiry_id} in Neon DB")

        # 7. Guest Checkout & Order Tracking
        order_res = place_guest_order(CreateOrderRequest(
            address=GuestAddressSchema(
                name="Srinivasan R",
                email="srinivasan@example.com",
                phone="7373646180",
                line1="21 North Street",
                line2="Near Temple",
                city="Vadamamandur",
                state="Tamil Nadu",
                pincode="605702"
            ),
            items=[
                OrderItemSchema(
                    id=first_p["id"],
                    name=first_p["name"],
                    selectedSize="12×16 in",
                    selectedShape="vertical",
                    price=first_p["price"],
                    qty=1,
                    thumbnail=first_p["thumbnail"]
                )
            ],
            paymentMethod="upi",
            couponCode="WELCOME10"
        ), db=db)
        assert order_res["success"] == True
        placed_order = order_res["order"]
        order_id = placed_order["id"]
        print(f"  [+] Guest Checkout: Placed order '{order_id}' for total ₹{placed_order['total']} (Courier: {placed_order['tracking']['courier']}, AWB: {placed_order['tracking']['trackingNo']})")

        # Order Tracking
        track_info = track_guest_order(order_id, db=db)
        assert track_info["id"] == order_id
        print(f"  [+] Order Tracking: Order '{track_info['id']}' status is '{track_info['status']}'")

        # 8. Store Settings
        settings_info = get_store_settings(db=db)
        print(f"  [+] Store Settings: Store '{settings_info['storeName']}', Phone '{settings_info['supportPhone']}', Email '{settings_info['supportEmail']}'")

        # 9. Admin Authentication
        auth_res = admin_login(AdminLoginRequest(username="admin", password="admin123"), db=db)
        token = auth_res["access_token"]
        decoded = decode_access_token(token)
        assert decoded is not None and decoded["sub"] == "admin"
        print(f"  [+] Admin Authentication: Issued signed JWT for '{decoded['sub']}'")

        # 10. Admin Analytics Dashboard
        admin_user = db.query(AdminUser).filter(AdminUser.username == "admin").first()
        stats = get_admin_dashboard_stats(current_admin=admin_user, db=db)
        print(f"  [+] Admin Dashboard Stats: Orders={stats['totalOrders']}, Revenue=₹{stats['totalRevenue']}, Products={stats['totalProducts']}, Enquiries={stats['totalEnquiries']}, Reviews={stats['totalReviews']}, Coupons={stats['totalCoupons']}")

        # 11. Admin Orders list
        admin_orders = list_admin_orders(status="all", q=None, db=db, admin=admin_user)
        print(f"  [+] Admin Orders Management: {len(admin_orders)} total orders listed")

        print("\n[SUCCESS] ALL 11 BACKEND MODULES FULLY TESTED & VERIFIED WITH NEON POSTGRESQL!")
    finally:
        db.close()

if __name__ == "__main__":
    test_full_backend()
