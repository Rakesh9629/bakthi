import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product, Category
from app.schemas import ProductCreateUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("")
def list_products(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    shape: Optional[str] = None,
    room: Optional[str] = None,
    price: Optional[str] = None,
    q: Optional[str] = None,
    sort: Optional[str] = "popular",
    page: Optional[int] = 1,
    page_size: Optional[int] = 50,
    db: Session = Depends(get_db)
):
    """
    Public product query endpoint supporting all storefront filters:
    category, collections (tag), shape, room, price range, search, and sorting.
    """
    query = db.query(Product).filter(Product.is_active == True)

    if category:
        query = query.filter(Product.category_slug == category)

    if tag == "featured":
        query = query.filter(Product.is_featured == True)
    elif tag == "bestseller":
        query = query.filter(Product.is_bestseller == True)
    elif tag == "new":
        query = query.filter(Product.is_new_arrival == True)

    if shape:
        query = query.filter(Product.shape == shape)

    if room:
        room_filter = f"%{room.lower()}%"
        query = query.filter(Product.room_json.ilike(room_filter))

    if price:
        # e.g. "0-500", "500-1000", "1000-2000", "2000-99999"
        try:
            parts = price.split("-")
            min_p = float(parts[0])
            max_p = float(parts[1]) if len(parts) > 1 else 999999.0
            query = query.filter(Product.price >= min_p, Product.price <= max_p)
        except Exception:
            pass

    if q:
        search_filter = f"%{q.lower().strip()}%"
        query = query.filter(
            (Product.name.ilike(search_filter)) | 
            (Product.deity.ilike(search_filter)) | 
            (Product.sku.ilike(search_filter)) |
            (Product.category_slug.ilike(search_filter))
        )

    # Sorting
    if sort == "newest":
        query = query.order_by(Product.created_at.desc())
    elif sort == "price-asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price-desc":
        query = query.order_by(Product.price.desc())
    elif sort == "rating":
        query = query.order_by(Product.rating.desc(), Product.review_count.desc())
    else: # popular
        query = query.order_by(Product.is_bestseller.desc(), Product.is_featured.desc(), Product.rating.desc(), Product.id.asc())

    # Pagination
    offset = (page - 1) * page_size
    products = query.offset(offset).limit(page_size).all()
    return [p.to_dict() for p in products]

@router.get("/{slug_or_id}")
def get_product(slug_or_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed product specifications by slug or numeric ID."""
    if slug_or_id.isdigit():
        product = db.query(Product).filter(Product.id == int(slug_or_id)).first()
    else:
        product = db.query(Product).filter(Product.slug == slug_or_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product frame not found.")
    return product.to_dict()

# --- Protected Admin Endpoints ---
@router.get("/admin/all")
def list_all_products_admin(
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve all products for administration, including inactive items and stock records."""
    products = db.query(Product).order_by(Product.id.desc()).all()
    return [p.to_dict() for p in products]

@router.post("/admin", status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreateUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new devotional acrylic frame."""
    slug = payload.name.lower().replace(" ", "-").replace("/", "-")
    base_slug = slug
    counter = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    sku_count = db.query(Product).count() + 1
    sku = f"BKT-{str(sku_count).padStart(4, '0')}" if hasattr(str, 'padStart') else f"BKT-{sku_count:04d}"

    discount = 0
    if payload.mrp > payload.price:
        discount = round(((payload.mrp - payload.price) / payload.mrp) * 100)

    thumb = payload.thumbnail or (payload.images[0] if payload.images else "https://picsum.photos/seed/default/400/500")

    product = Product(
        name=payload.name,
        deity=payload.deity,
        slug=slug,
        category_slug=payload.category,
        price=payload.price,
        mrp=payload.mrp,
        discount=discount,
        stock=payload.stock,
        sku=sku,
        thumbnail=thumb,
        images_json=json.dumps(payload.images if payload.images else [thumb]),
        sizes_json=json.dumps(payload.sizes if payload.sizes else [
            {"label": "6×8 in", "value": "6x8", "price": payload.price},
            {"label": "12×16 in", "value": "12x16", "price": payload.price + 200},
            {"label": "18×24 in", "value": "18x24", "price": payload.price + 500},
            {"label": "24×36 in", "value": "24x36", "price": payload.price + 1000},
        ]),
        shapes_json=json.dumps(payload.shapes if payload.shapes else ["vertical", "horizontal", "square"]),
        material=payload.material or "Premium Acrylic",
        thickness=payload.thickness or "5mm",
        finish=payload.finish or "Glossy UV Print",
        room_json=json.dumps(payload.room if payload.room else ["pooja-room", "living-room"]),
        shape=payload.shape or "vertical",
        description=payload.description or f"Auspicious {payload.name} crafted in 5mm glossy museum-grade acrylic.",
        features_json=json.dumps(payload.features if payload.features else ['5mm Premium Acrylic', 'UV Resistant Print', 'Ready to Hang', 'Scratch Resistant', 'Waterproof']),
        is_featured=payload.isFeatured,
        is_bestseller=payload.isBestseller,
        is_new_arrival=payload.isNewArrival,
        is_active=payload.isActive,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product.to_dict()

@router.put("/admin/{product_id}")
def update_product(
    product_id: int,
    payload: ProductCreateUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update details of an existing product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    product.name = payload.name
    product.deity = payload.deity
    product.category_slug = payload.category
    product.price = payload.price
    product.mrp = payload.mrp
    product.stock = payload.stock
    if payload.mrp > payload.price:
        product.discount = round(((payload.mrp - payload.price) / payload.mrp) * 100)
    
    if payload.thumbnail:
        product.thumbnail = payload.thumbnail
    if payload.images:
        product.images_json = json.dumps(payload.images)
    if payload.sizes:
        product.sizes_json = json.dumps(payload.sizes)
    if payload.shapes:
        product.shapes_json = json.dumps(payload.shapes)
    if payload.room:
        product.room_json = json.dumps(payload.room)
    if payload.shape:
        product.shape = payload.shape
    if payload.material:
        product.material = payload.material
    if payload.thickness:
        product.thickness = payload.thickness
    if payload.finish:
        product.finish = payload.finish
    if payload.description is not None:
        product.description = payload.description
    if payload.features is not None:
        product.features_json = json.dumps(payload.features)

    product.is_featured = payload.isFeatured
    product.is_bestseller = payload.isBestseller
    product.is_new_arrival = payload.isNewArrival
    product.is_active = payload.isActive

    db.commit()
    db.refresh(product)
    return product.to_dict()

@router.patch("/admin/{product_id}/stock")
def update_product_stock(
    product_id: int,
    stock: int = Query(..., ge=0),
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Quickly update stock inventory level for a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    product.stock = stock
    db.commit()
    return {"id": product.id, "stock": product.stock, "success": True}

@router.delete("/admin/{product_id}")
def delete_product(
    product_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a product from the database."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    db.delete(product)
    db.commit()
    return {"success": True, "message": f"Product '{product.name}' deleted successfully."}
