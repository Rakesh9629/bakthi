from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Review
from app.schemas import ReviewCreate
from app.auth import get_current_admin

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@router.get("")
def list_reviews(db: Session = Depends(get_db)):
    """Retrieve all verified customer testimonials and reviews."""
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    return [r.to_dict() for r in reviews]

@router.post("", status_code=status.HTTP_201_CREATED)
def submit_review(payload: ReviewCreate, db: Session = Depends(get_db)):
    """Submit a new customer review."""
    review = Review(
        name=payload.name.strip(),
        city=payload.city.strip() if payload.city else "India",
        rating=payload.rating,
        text=payload.text.strip(),
        product=payload.product or "Bhakthi Divine Frame",
        verified=True,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return {
        "success": True,
        "message": "Thank you for sharing your divine experience! Review submitted.",
        "review": review.to_dict()
    }

@router.delete("/admin/{review_id}")
def delete_review(
    review_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin remove a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    db.delete(review)
    db.commit()
    return {"success": True, "message": "Review removed."}

