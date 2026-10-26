from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ContactEnquiry
from app.schemas import ContactFormRequest, ContactFormResponse
from app.email_service import check_rate_limit, send_contact_email

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("", response_model=ContactFormResponse)
def submit_contact_form(
    payload: ContactFormRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    # 1. Rate limiting & spam protection
    client_ip = request.client.host if (request and request.client) else "127.0.0.1"
    rate_limit_key = f"{client_ip}:{payload.email}"
    if not check_rate_limit(rate_limit_key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many contact submissions from your device. Please wait a few minutes before trying again or reach us directly on WhatsApp."
        )

    # 2. Store contact enquiry in database for record keeping
    enquiry = ContactEnquiry(
        name=payload.name,
        email=payload.email,
        phone=payload.phone or "",
        subject=payload.subject,
        message=payload.message,
        email_sent=False,
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    # 3. Deliver email to business email (bhakthiprintings@gmail.com)
    email_delivered, email_msg = send_contact_email(
        name=payload.name,
        email=payload.email,
        phone=payload.phone or "",
        subject=payload.subject,
        message=payload.message
    )

    # Update database record with transmission outcome
    enquiry.email_sent = email_delivered
    enquiry.email_error = None if email_delivered else email_msg
    db.commit()

    if not email_delivered:
        # Check if it was because SMTP credentials are not yet configured
        if "awaiting SMTP credentials" in email_msg:
            return ContactFormResponse(
                success=True,
                enquiry_id=enquiry.id,
                email_delivered=False,
                message=(
                    "Your message has been received and saved securely in our system! "
                    "Our devotional team at Bhakthi Printings will review it shortly. "
                    "For instant replies, you can also reach us directly via WhatsApp at +91 7373646180."
                )
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unable to transmit email message: {email_msg}. Please try WhatsApp at +91 7373646180."
            )

    return ContactFormResponse(
        success=True,
        enquiry_id=enquiry.id,
        email_delivered=True,
        message="Thank you! Your message has been sent to Bhakthi Printings. We will get back to you shortly."
    )

