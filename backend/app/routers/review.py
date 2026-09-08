import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.review import Review
from app.models.restaurant import Restaurant
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


@router.post(
    "",
    response_model=ReviewResponse,
    status_code=201,
    summary="Create a review", 
    description=( 
        "Creates a review for a restaurant. " 
        "Only authenticated reviewers can submit reviews, " 
        "and each reviewer can review a restaurant only once." 
    )
)
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(
        "Review creation attempt by user: %s",
        current_user.id
    )

    # Only reviewers can write reviews
    if current_user.role != "reviewer":
        logger.warning(
            "Review creation denied: user_id=%s, role=%s",
            current_user.id,
            current_user.role
        )

        raise HTTPException(
            status_code=403,
            detail="Only reviewers can write reviews"
        )

    # Check restaurant exists
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == review_data.restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    # Prevent duplicate reviews
    existing_review = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.restaurant_id == review_data.restaurant_id
    ).first()

    if existing_review:
        raise HTTPException(
            status_code=409,
            detail="You have already reviewed this restaurant"
        )
    
    # Create review
    review = Review(
        user_id=current_user.id,
        restaurant_id=review_data.restaurant_id,
        rating=review_data.rating,
        comment=review_data.comment
    )

    db.add(review)

    # Update restaurant rating information
    restaurant.rating_sum += review_data.rating
    restaurant.rating_count += 1
    restaurant.average_rating = (
        restaurant.rating_sum / restaurant.rating_count
    )

    db.commit()
    db.refresh(review)

    logger.info(
        "Review created successfully: id=%s, restaurant_id=%s",
        review.id,
        review.restaurant_id
    )

    return {
        "id": review.id,
        "user_id": review.user_id,
        "restaurant_id": review.restaurant_id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at,
        "reviewer_first_name": current_user.first_name,
        "reviewer_last_name": current_user.last_name
    }

@router.get(
    "/restaurant/{restaurant_id}",
    response_model=list[ReviewResponse],
    status_code=200,
    summary="Get restaurant reviews", 
    description=( 
        "Returns all reviews for a specific restaurant, " 
        "including reviewer name, rating, comment, and date." 
    )
)
def get_restaurant_reviews(
    restaurant_id: UUID,
    db: Session = Depends(get_db)
):
    logger.info(
        "Fetching reviews for restaurant: id=%s",
        restaurant_id
    )

    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        logger.warning(
            "Restaurant not found: id=%s",
            restaurant_id
        )

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    reviews = (
        db.query(Review, User)
        .join(User, Review.user_id == User.id)
        .filter(Review.restaurant_id == restaurant_id)
        .all()
    )

    return [
        {
            "id": review.id,
            "user_id": review.user_id,
            "restaurant_id": review.restaurant_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "reviewer_first_name": user.first_name,
            "reviewer_last_name": user.last_name
        }
        for review, user in reviews
    ]