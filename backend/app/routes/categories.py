from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Category, Product
from app.auth import get_current_admin
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/categories", tags=["Categories"])

class CategoryCreateUpdate(BaseModel):
    name: str
    slug: Optional[str] = None
    icon: Optional[str] = "🕉️"
    description: Optional[str] = ""

@router.get("")
def list_categories(db: Session = Depends(get_db)):
    """Retrieve all categories with real-time product counts."""
    cats = db.query(Category).order_by(Category.id.asc()).all()
    result = []
    for c in cats:
        p_count = db.query(Product).filter(
            Product.category_slug == c.slug,
            Product.is_active == True
        ).count()
        result.append({
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "icon": c.icon,
            "description": c.description,
            "count": p_count
        })
    return result

@router.post("/admin", status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreateUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new deity category."""
    slug = payload.slug or payload.name.lower().replace(" ", "-").replace("/", "-")
    existing = db.query(Category).filter(Category.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists.")
    cat = Category(
        name=payload.name,
        slug=slug,
        icon=payload.icon or "🕉️",
        description=payload.description or ""
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat.to_dict()

@router.put("/admin/{category_id}")
def update_category(
    category_id: int,
    payload: CategoryCreateUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update deity category details."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    cat.name = payload.name
    if payload.slug:
        cat.slug = payload.slug
    if payload.icon:
        cat.icon = payload.icon
    if payload.description is not None:
        cat.description = payload.description
    db.commit()
    db.refresh(cat)
    return cat.to_dict()

@router.delete("/admin/{category_id}")
def delete_category(
    category_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a deity category."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    db.delete(cat)
    db.commit()
    return {"success": True, "message": "Category deleted."}
