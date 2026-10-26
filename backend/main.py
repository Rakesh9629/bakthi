from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routes import contact, products, categories, orders, admin, coupons, reviews, settings as settings_route


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    try:
        Base.metadata.create_all(bind=engine)
        # Seed initial data if tables are empty
        with SessionLocal() as db:
            seed_database(db)
    except Exception as e:
        print(f"[Warning] Database initialization error: {e}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Devotional Acrylic Photo Frames E-Commerce Backend",
    lifespan=lifespan,
)

# CORS configuration - allows frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(orders.router)
app.include_router(contact.router)
app.include_router(coupons.router)
app.include_router(reviews.router)
app.include_router(settings_route.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "business": settings.BUSINESS_NAME,
        "phone": settings.BUSINESS_PHONE,
        "email": settings.BUSINESS_EMAIL,
        "docs": "/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Bhakthi Printings Backend API"}
