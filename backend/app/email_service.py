import smtplib
import time
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Tuple, Dict, List
from app.config import settings

logger = logging.getLogger(__name__)

# Simple in-memory rate limiter: {ip_or_email: [timestamps]}
RATE_LIMIT_STORE: Dict[str, List[float]] = {}
RATE_LIMIT_WINDOW_SECONDS = 600  # 10 minutes
MAX_REQUESTS_PER_WINDOW = 5

def check_rate_limit(client_id: str) -> bool:
    """Returns True if within rate limit, False if exceeded."""
    now = time.time()
    timestamps = RATE_LIMIT_STORE.get(client_id, [])
    # Filter out timestamps older than window
    timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SECONDS]
    if len(timestamps) >= MAX_REQUESTS_PER_WINDOW:
        RATE_LIMIT_STORE[client_id] = timestamps
        return False
    timestamps.append(now)
    RATE_LIMIT_STORE[client_id] = timestamps
    return True

def send_contact_email(
    name: str,
    email: str,
    phone: str,
    subject: str,
    message: str
) -> Tuple[bool, str]:
    """
    Sends customer contact message to bhakthiprintings@gmail.com.
    Returns (True, "Success message") or (False, "Error message").
    """
    dest_email = settings.CONTACT_RECEIVER_EMAIL or "bhakthiprintings@gmail.com"
    
    # Check if SMTP is configured
    if not settings.SMTP_HOST or not settings.SMTP_PASSWORD:
        err_msg = (
            "Email service is awaiting SMTP credentials configuration. "
            "Please configure SMTP_HOST, SMTP_PORT, and SMTP_PASSWORD in backend/.env. "
            "In the meantime, your inquiry has been securely recorded in the database."
        )
        logger.warning(f"SMTP not configured: {err_msg}")
        return False, err_msg

    try:
        # Build multipart message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🔔 [Bhakthi Printings Inquiry] {subject} - from {name}"
        msg["From"] = f"Bhakthi Printings Web <{settings.SMTP_USERNAME}>"
        msg["To"] = dest_email
        msg["Reply-To"] = email

        # Plain text version
        plain_body = f"""New Devotional Art Inquiry - Bhakthi Printings
==================================================

Customer Name:   {name}
Customer Email:  {email}
Contact Phone:   {phone or 'Not provided'}
Subject:         {subject}

Message:
--------
{message}

==================================================
Submitted via Bhakthi Printings Website Contact Form
Official Shop: 21 North Street, Vadamamandur, Kallakurichi District, Tamil Nadu – 605702
"""

        # HTML formatted version
        html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Inter', sans-serif, Arial; color: #1c1917; background-color: #faf7f0; padding: 20px; }}
    .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #fed7aa; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }}
    .header {{ border-bottom: 2px solid #7f1d1d; padding-bottom: 12px; margin-bottom: 20px; }}
    .title {{ font-size: 20px; font-weight: bold; color: #7f1d1d; }}
    .field {{ margin-bottom: 12px; }}
    .label {{ font-size: 12px; font-weight: bold; color: #b45309; text-transform: uppercase; }}
    .value {{ font-size: 14px; color: #292524; margin-top: 2px; }}
    .message-box {{ background: #fffdfa; border-left: 4px solid #b45309; padding: 14px; border-radius: 4px; margin-top: 16px; font-size: 14px; line-height: 1.6; }}
    .footer {{ margin-top: 24px; padding-top: 12px; border-top: 1px solid #f5f5f4; font-size: 11px; color: #78716c; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">🕉️ Bhakthi Printings — Customer Inquiry</div>
      <div style="font-size: 12px; color: #78716c;">New message received through your website contact form</div>
    </div>
    <div class="field">
      <div class="label">Customer Name</div>
      <div class="value">{name}</div>
    </div>
    <div class="field">
      <div class="label">Email Address</div>
      <div class="value"><a href="mailto:{email}" style="color: #7f1d1d; text-decoration: none; font-weight: 600;">{email}</a></div>
    </div>
    <div class="field">
      <div class="label">Mobile Number</div>
      <div class="value">{phone if phone else 'Not provided'}</div>
    </div>
    <div class="field">
      <div class="label">Inquiry Subject</div>
      <div class="value">{subject}</div>
    </div>
    <div class="label">Customer Message</div>
    <div class="message-box">{message.replace(chr(10), '<br>')}</div>
    <div class="footer">
      <strong>Bhakthi Printings</strong> • 21 North Street, Vadamamandur, Kallakurichi District, Tamil Nadu – 605702, India.<br>
      Helpline: +91 7373646180 | Email: bhakthiprintings@gmail.com
    </div>
  </div>
</body>
</html>"""

        msg.attach(MIMEText(plain_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        # Connect to SMTP server
        if settings.SMTP_USE_SSL:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_USERNAME, [dest_email], msg.as_string())
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
                if settings.SMTP_USE_TLS:
                    server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_USERNAME, [dest_email], msg.as_string())

        logger.info(f"Contact email successfully sent to {dest_email} for customer {name}.")
        return True, "Your message has been delivered to Bhakthi Printings successfully!"
    except smtplib.SMTPAuthenticationError:
        err = "SMTP Authentication failed. Please check SMTP_USERNAME and SMTP_PASSWORD in backend/.env."
        logger.error(err)
        return False, err
    except smtplib.SMTPConnectError:
        err = "Failed to connect to SMTP server. Please verify SMTP_HOST and SMTP_PORT."
        logger.error(err)
        return False, err
    except Exception as e:
        err = f"Failed to send email: {str(e)}"
        logger.error(f"Email delivery exception: {e}")
        return False, err

