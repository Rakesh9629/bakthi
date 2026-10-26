import json
import logging
from sqlalchemy.orm import Session
from app.models import Category, Product, AdminUser, Coupon, Review, StoreSetting, Order, OrderItem
from app.auth import hash_password

logger = logging.getLogger(__name__)

INITIAL_CATEGORIES = [
    {"slug": "lord-ganesha", "name": "Lord Ganesha", "icon": "🐘", "description": "Auspicious Ganesha frames for home, pooja mandirs and office entrances"},
    {"slug": "lord-krishna", "name": "Lord Krishna", "icon": "🦚", "description": "Divine Bal Krishna and Flute Krishna frames in premium 5mm acrylic"},
    {"slug": "radha-krishna", "name": "Radha Krishna", "icon": "💛", "description": "Eternal divine love and harmony of Radha and Krishna"},
    {"slug": "lord-shiva", "name": "Lord Shiva", "icon": "🔱", "description": "Meditative Mahadev, Nataraja and Trishul frames for sacred peace"},
    {"slug": "lord-murugan", "name": "Lord Murugan", "icon": "⚡", "description": "Vel Murugan, Palani and Swaminatha Swamy frames for Tamil devotees"},
    {"slug": "lord-hanuman", "name": "Lord Hanuman", "icon": "🙏", "description": "Bajrangbali and Panchamukhi Hanuman frames for protection and strength"},
    {"slug": "lord-rama", "name": "Lord Rama & Ram Darbar", "icon": "🏹", "description": "Ayodhya Ram Darbar, Sita Ram and Lakshman frames"},
    {"slug": "goddess-lakshmi", "name": "Goddess Lakshmi", "icon": "🪷", "description": "Ashta Lakshmi and Dhanalakshmi frames for prosperity and abundance"},
    {"slug": "goddess-saraswati", "name": "Goddess Saraswati", "icon": "🎵", "description": "Saraswati Devi frames for education, arts, wisdom and knowledge"},
    {"slug": "lord-venkateswara", "name": "Lord Venkateswara", "icon": "⭐", "description": "Tirupati Balaji Govinda frames with gold foil finish"},
    {"slug": "durga-amman", "name": "Durga Amman", "icon": "🌺", "description": "Maha Kali, Durga and Amman frames for divine protection"},
    {"slug": "other-devotional", "name": "Other Sacred Deities", "icon": "🕉️", "description": "Lord Ayyappa, Shirdi Sai Baba, Raghavendra Swami and custom kuladeivam frames"},
]

def img(seed: str, w: int = 400, h: int = 500) -> str:
    return f"https://picsum.photos/seed/{seed}/{w}/{h}"

def make_product_dict(id, name, deity, slug, category, price, mrp, images, tags=None):
    if tags is None:
        tags = []
    discount = round(((mrp - price) / mrp) * 100)
    sizes = [
        {"label": "6×8 in", "value": "6x8", "price": price},
        {"label": "12×16 in", "value": "12x16", "price": price + 200},
        {"label": "18×24 in", "value": "18x24", "price": price + 500},
        {"label": "24×36 in", "value": "24x36", "price": price + 1000},
    ]
    return {
        "id": id,
        "name": name,
        "deity": deity,
        "slug": slug,
        "category_slug": category,
        "price": float(price),
        "mrp": float(mrp),
        "discount": discount,
        "stock": 25 + (id * 3) % 30,
        "sku": f"BKT-{id:04d}",
        "thumbnail": images[0],
        "images": images,
        "sizes": sizes,
        "shapes": ["vertical", "horizontal", "square"],
        "material": "Premium Acrylic",
        "thickness": "5mm",
        "finish": "Glossy UV Print",
        "room": ["pooja-room", "living-room"],
        "shape": "horizontal" if "horizontal" in slug else "round" if "round" in slug else "vertical",
        "description": f"This premium {name} acrylic frame is crafted with high-quality 5mm acrylic glass and UV-resistant printing technology. Perfect for your pooja room, living room or as an auspicious gift. The vibrant colors and sharp details make this a divine addition to any space.",
        "features": ["5mm Premium Acrylic", "UV Resistant Print", "Ready to Hang", "Scratch Resistant", "Waterproof"],
        "is_featured": "featured" in tags,
        "is_bestseller": "bestseller" in tags,
        "is_new_arrival": "new" in tags,
        "is_active": True,
        "rating": round(4.2 + (id % 8) * 0.1, 1),
        "review_count": 35 + (id * 7) % 150,
    }

INITIAL_PRODUCTS = [
    make_product_dict(1, "Lord Ganesha Blessing", "Lord Ganesha", "lord-ganesha-blessing", "lord-ganesha", 799, 1299, [img("ganesha1"), img("ganesha2"), img("ganesha3")], ["featured", "bestseller"]),
    make_product_dict(2, "Ganesha Chaturthi Special", "Lord Ganesha", "ganesha-chaturthi-special", "lord-ganesha", 999, 1599, [img("ganesha4"), img("ganesha5")], ["new"]),
    make_product_dict(3, "Lord Krishna Flute", "Lord Krishna", "lord-krishna-flute", "lord-krishna", 849, 1399, [img("krishna1"), img("krishna2"), img("krishna3")], ["featured", "bestseller"]),
    make_product_dict(4, "Bal Krishna", "Lord Krishna", "bal-krishna", "lord-krishna", 699, 999, [img("krishna3"), img("krishna4")], ["new"]),
    make_product_dict(5, "Radha Krishna Divine Love", "Radha Krishna", "radha-krishna-divine-love", "radha-krishna", 1099, 1799, [img("radha1"), img("radha2"), img("radha3")], ["featured", "bestseller"]),
    make_product_dict(6, "Radha Krishna Vrindavan", "Radha Krishna", "radha-krishna-vrindavan", "radha-krishna", 899, 1299, [img("radha3"), img("radha4")], []),
    make_product_dict(7, "Lord Shiva Meditation", "Lord Shiva", "lord-shiva-meditation", "lord-shiva", 799, 1199, [img("shiva1"), img("shiva2"), img("shiva3")], ["featured"]),
    make_product_dict(8, "Mahadev Trishul", "Lord Shiva", "mahadev-trishul", "lord-shiva", 949, 1499, [img("shiva3"), img("shiva4")], ["bestseller"]),
    make_product_dict(9, "Lord Murugan Vel", "Lord Murugan", "lord-murugan-vel", "lord-murugan", 749, 1099, [img("murugan1"), img("murugan2")], ["new"]),
    make_product_dict(10, "Bajrangbali Hanuman", "Lord Hanuman", "bajrangbali-hanuman", "lord-hanuman", 799, 1199, [img("hanuman1"), img("hanuman2"), img("hanuman3")], ["bestseller"]),
    make_product_dict(11, "Ram Darbar", "Lord Rama", "ram-darbar", "lord-rama", 1199, 1999, [img("rama1"), img("rama2"), img("rama3")], ["featured", "bestseller"]),
    make_product_dict(12, "Sita Ram", "Lord Rama", "sita-ram", "lord-rama", 899, 1299, [img("rama3"), img("rama4")], []),
    make_product_dict(13, "Mahalakshmi Prosperity", "Goddess Lakshmi", "mahalakshmi-prosperity", "goddess-lakshmi", 849, 1299, [img("lakshmi1"), img("lakshmi2"), img("lakshmi3")], ["featured", "bestseller"]),
    make_product_dict(14, "Lakshmi Diwali Special", "Goddess Lakshmi", "lakshmi-diwali-special", "goddess-lakshmi", 999, 1599, [img("lakshmi3"), img("lakshmi4")], ["new"]),
    make_product_dict(15, "Goddess Saraswati", "Goddess Saraswati", "goddess-saraswati", "goddess-saraswati", 749, 1099, [img("saraswati1"), img("saraswati2")], []),
    make_product_dict(16, "Lord Venkateswara", "Lord Venkateswara", "lord-venkateswara", "lord-venkateswara", 899, 1399, [img("venkat1"), img("venkat2"), img("venkat3")], ["featured", "bestseller"]),
    make_product_dict(17, "Tirupati Balaji Gold", "Lord Venkateswara", "tirupati-balaji-gold", "lord-venkateswara", 1299, 1999, [img("venkat3"), img("venkat4")], ["new"]),
    make_product_dict(18, "Durga Amman Power", "Durga Amman", "durga-amman-power", "durga-amman", 849, 1299, [img("durga1"), img("durga2"), img("durga3")], ["bestseller"]),
    make_product_dict(19, "Navratri Durga Special", "Durga Amman", "navratri-durga-special", "durga-amman", 999, 1599, [img("durga3"), img("durga4")], ["new"]),
    make_product_dict(20, "Ayyappa Swami", "Lord Ayyappa", "ayyappa-swami", "other-devotional", 749, 1099, [img("ayyappa1"), img("ayyappa2")], []),
    make_product_dict(21, "Sai Baba Blessing", "Sai Baba", "sai-baba-blessing", "other-devotional", 799, 1199, [img("saibaba1"), img("saibaba2"), img("saibaba3")], ["bestseller"]),
    make_product_dict(22, "Combo: Ganesha + Lakshmi", "Multiple", "combo-ganesha-lakshmi", "other-devotional", 1499, 2499, [img("combo1"), img("combo2")], ["featured", "new"]),
    make_product_dict(23, "Ganesha Round Frame", "Lord Ganesha", "ganesha-round-frame", "lord-ganesha", 899, 1399, [img("ganesha6"), img("ganesha7")], ["new"]),
    make_product_dict(24, "Krishna Horizontal Art", "Lord Krishna", "krishna-horizontal-art", "lord-krishna", 1099, 1699, [img("krishna5"), img("krishna6")], ["featured"]),
]

INITIAL_COUPONS = [
    {"code": "WELCOME10", "discount": 10.0, "type": "percent", "min_order": 500.0, "description": "10% off on your first sacred order"},
    {"code": "DIWALI20", "discount": 20.0, "type": "percent", "min_order": 1000.0, "description": "20% off on orders above ₹1000"},
    {"code": "FLAT100", "discount": 100.0, "type": "flat", "min_order": 799.0, "description": "₹100 flat instant savings above ₹799"},
]

INITIAL_REVIEWS = [
    {"name": "Priya Sharma", "city": "Chennai", "rating": 5, "text": "Absolutely beautiful quality! The Radha Krishna frame looks stunning in our pooja room. Colors are vibrant and the 5mm acrylic is thick and crystal clear.", "product": "Radha Krishna Divine Love"},
    {"name": "Rajesh Kumar", "city": "Bangalore", "rating": 5, "text": "Ordered the Ram Darbar frame for my parents' 50th wedding anniversary. Packaging was ultra-secure and delivery was fast. Deeply blessed!", "product": "Ram Darbar"},
    {"name": "Meena Iyer", "city": "Coimbatore", "rating": 5, "text": "The Lord Murugan Vel frame has lifelike brilliance. High-gloss finish is completely incense smoke proof. Highly recommend Bhakthi Printings.", "product": "Lord Murugan Vel"},
    {"name": "Suresh Patel", "city": "Ahmedabad", "rating": 4, "text": "Good quality product. The Ganesha frame brings peaceful energy to our living room entrance.", "product": "Lord Ganesha Blessing"},
    {"name": "Anitha Reddy", "city": "Hyderabad", "rating": 5, "text": "Gifted the Mahalakshmi frame to my sister for Grihapravesham housewarming. Top-notch build and pristine packaging.", "product": "Mahalakshmi Prosperity"},
    {"name": "Karthik Nair", "city": "Kochi", "rating": 5, "text": "Best devotional acrylic frames online in India. The print sharpness and acrylic thickness are unmatched.", "product": "Lord Venkateswara"},
]

def seed_database(db: Session):
    """Populates Neon PostgreSQL database with essential catalog and administrator records."""
    # 1. Admin User
    admin = db.query(AdminUser).filter(AdminUser.username == "admin").first()
    if not admin:
        admin = AdminUser(
            username="admin",
            email="bhakthiprintings@gmail.com",
            hashed_password=hash_password("admin123"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        logger.info("[+] Seeded default admin account: admin / admin123")

    # 2. Categories
    for c in INITIAL_CATEGORIES:
        existing = db.query(Category).filter(Category.slug == c["slug"]).first()
        if not existing:
            cat = Category(
                slug=c["slug"],
                name=c["name"],
                icon=c["icon"],
                description=c["description"],
                count=0
            )
            db.add(cat)
    db.commit()

    # 3. Products
    for p in INITIAL_PRODUCTS:
        existing = db.query(Product).filter(Product.slug == p["slug"]).first()
        if not existing:
            prod = Product(
                name=p["name"],
                deity=p["deity"],
                slug=p["slug"],
                category_slug=p["category_slug"],
                price=p["price"],
                mrp=p["mrp"],
                discount=p["discount"],
                stock=p["stock"],
                sku=p["sku"],
                thumbnail=p["thumbnail"],
                images_json=json.dumps(p["images"]),
                sizes_json=json.dumps(p["sizes"]),
                shapes_json=json.dumps(p["shapes"]),
                material=p.get("material", "Premium Acrylic"),
                thickness=p.get("thickness", "5mm"),
                finish=p.get("finish", "Glossy UV Print"),
                room_json=json.dumps(p.get("room", ["pooja-room", "living-room"])),
                shape=p.get("shape", "vertical"),
                description=p["description"],
                features_json=json.dumps(p["features"]),
                is_featured=p["is_featured"],
                is_bestseller=p["is_bestseller"],
                is_new_arrival=p["is_new_arrival"],
                is_active=p["is_active"],
                rating=p["rating"],
                review_count=p["review_count"],
            )
            db.add(prod)
    db.commit()

    # 4. Coupons
    for c in INITIAL_COUPONS:
        existing = db.query(Coupon).filter(Coupon.code == c["code"]).first()
        if not existing:
            coup = Coupon(
                code=c["code"],
                discount=c["discount"],
                type=c["type"],
                min_order=c["min_order"],
                description=c["description"],
                is_active=True
            )
            db.add(coup)
    db.commit()

    # 5. Reviews
    if db.query(Review).count() == 0:
        for r in INITIAL_REVIEWS:
            rev = Review(
                name=r["name"],
                city=r["city"],
                rating=r["rating"],
                text=r["text"],
                product=r["product"],
                verified=True
            )
            db.add(rev)
        db.commit()

    # 6. Store Settings
    setting = db.query(StoreSetting).first()
    if not setting:
        s = StoreSetting(
            store_name="Bhakthi Printings",
            tagline="Premium Devotional Acrylic Frames",
            support_phone="+91 7373646180",
            support_email="bhakthiprintings@gmail.com",
            shipping_threshold=999.0,
            standard_shipping_fee=99.0,
            address="21 North Street, Vadamamandur, Kallakurichi District, Tamil Nadu – 605702, India",
        )
        db.add(s)
        db.commit()

    # 7. Demo Orders (if empty)
    if db.query(Order).count() == 0:
        demo_order = Order(
            id="BKT-2026-001",
            customer_name="Devotee Customer",
            customer_email="bhakthiprintings@gmail.com",
            customer_phone="7373646180",
            line1="21 North Street",
            line2="Near Temple",
            city="Vadamamandur",
            state="Tamil Nadu",
            pincode="605702",
            subtotal=1798.0,
            shipping_fee=0.0,
            discount_amount=0.0,
            total_amount=1798.0,
            payment_method="upi",
            payment_status="paid",
            order_status="delivered",
            tracking_courier="Delhivery Express",
            tracking_number="DL123456789IN",
            tracking_status="Delivered",
        )
        db.add(demo_order)
        db.flush()
        db.add(OrderItem(
            order_id="BKT-2026-001",
            product_name="Lord Ganesha Blessing",
            selected_size="12×16 in",
            selected_shape="vertical",
            price=799.0,
            quantity=1,
            thumbnail=img("ganesha1"),
        ))
        db.commit()

    logger.info("[+] Database seed verification complete.")
