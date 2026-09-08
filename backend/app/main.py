import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import User, Restaurant, Review
from app.routers import user_router, restaurant_router, review_router
from app.core.config import settings


# Configure application-wide logging.
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s:     %(message)s"
)


# Create the FastAPI application.
app = FastAPI(
    title="DineReview API",
    version="1.0.0"
)


# ---------------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------------
#
# The frontend and backend run on different origins.
#
# Local development:
# Frontend -> http://localhost:5173
# Backend  -> http://127.0.0.1:8000
#
# The frontend URL is read from the .env file instead of
# being hardcoded here.
#
# When we deploy the application, we can simply change:
#
# FRONTEND_URL=https://your-production-frontend.com
#
# without modifying this Python file.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROUTES
# ---------------------------------------------------------
#
# Register all application routers.
app.include_router(user_router)
app.include_router(restaurant_router)
app.include_router(review_router)


# ---------------------------------------------------------
# ROOT ENDPOINT
# ---------------------------------------------------------
#
# Simple endpoint used to verify that the backend is running.
@app.get("/")
def root():
    return {
        "message": "Restaurant Review API"
    }
