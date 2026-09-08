import logging
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_restaurant_owner
from app.models.restaurant import Restaurant
from app.models.user import User
from app.schemas.restaurant import (
    RestaurantCreate,
    RestaurantResponse,
    RestaurantUpdate,
    RestaurantListResponse,
)


logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/restaurants",
    tags=["Restaurants"]
)


@router.get(
    "",
    response_model=RestaurantListResponse,
    summary="Get restaurants",
    description=(
        "Returns a paginated list of restaurants. "
        "Restaurants can optionally be filtered by city, cuisine, "
        "minimum rating, and maximum rating."
    )
)
def get_restaurants(
    city: str | None = Query(
        default=None,
        description="Filter restaurants by city"
    ),
    cuisine: str | None = Query(
        default=None,
        description="Filter restaurants by cuisine"
    ),
    min_rating: Decimal | None = Query(
        default=None,
        ge=0,
        le=5,
        description="Minimum average rating"
    ),
    max_rating: Decimal | None = Query(
        default=None,
        ge=0,
        le=5,
        description="Maximum average rating"
    ),
    page: int = Query(
        default=1,
        ge=1,
        description="Page number to retrieve"
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of restaurants to return per page"
    ),
    db: Session = Depends(get_db)
):
    """
    Fetch restaurants using optional filters and pagination.

    Filters are applied before pagination so that pagination
    works correctly with the selected filters.
    """

    query = db.query(Restaurant)

    # Apply city filter.
    if city is not None:
        query = query.filter(
            Restaurant.city.ilike(f"%{city}%")
        )

    # Apply cuisine filter.
    if cuisine is not None:
        query = query.filter(
            Restaurant.cuisine.ilike(f"%{cuisine}%")
        )

    # Apply minimum rating filter.
    if min_rating is not None:
        query = query.filter(
            Restaurant.average_rating >= min_rating
        )

    # Apply maximum rating filter.
    if max_rating is not None:
        query = query.filter(
            Restaurant.average_rating <= max_rating
        )

    # Calculate how many restaurants to skip.
    #
    # Page 1 -> skip 0
    # Page 2 -> skip limit
    # Page 3 -> skip limit * 2
    offset = (page - 1) * limit

    # Fetch one additional restaurant.
    #
    # This extra record is used only to determine whether
    # another page exists.
    restaurants = (
        query
        .offset(offset)
        .limit(limit + 1)
        .all()
    )

    # If we received more restaurants than requested,
    # another page is available.
    has_more = len(restaurants) > limit

    # Remove the extra restaurant before returning the response.
    restaurants = restaurants[:limit]

    return {
        "items": restaurants,
        "page": page,
        "limit": limit,
        "has_more": has_more
    }


@router.get(
    "/owned",
    response_model=list[RestaurantResponse],
    summary="Get my restaurants",
    description="Returns all restaurants owned by the currently authenticated owner."
)
def get_my_restaurants(
    current_user: User = Depends(require_restaurant_owner),
    db: Session = Depends(get_db)
):
    return db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).all()


@router.post(
    "",
    response_model=RestaurantResponse,
    status_code=201,
    summary="Create restaurant",
    description="Creates a new restaurant for the currently authenticated owner."
)
def create_restaurant(
    restaurant_data: RestaurantCreate,
    current_user: User = Depends(require_restaurant_owner),
    db: Session = Depends(get_db)
):
    restaurant = Restaurant(
        owner_id=current_user.id,
        restaurant_name=restaurant_data.restaurant_name,
        city=restaurant_data.city,
        cuisine=restaurant_data.cuisine,
        preview_image=restaurant_data.preview_image,
        description=restaurant_data.description
    )

    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)

    return restaurant


@router.get(
    "/{restaurant_id}",
    response_model=RestaurantResponse,
    summary="Get restaurant",
    description="Returns details of a specific restaurant using its unique ID."
)
def get_restaurant(
    restaurant_id: UUID,
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    return restaurant


@router.put(
    "/{restaurant_id}",
    response_model=RestaurantResponse,
    summary="Update restaurant",
    description="Updates a restaurant. Only its owner can perform this operation."
)
def update_restaurant(
    restaurant_id: UUID,
    restaurant_data: RestaurantUpdate,
    current_user: User = Depends(require_restaurant_owner),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    if restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own restaurant"
        )

    restaurant.restaurant_name = restaurant_data.restaurant_name
    restaurant.city = restaurant_data.city
    restaurant.cuisine = restaurant_data.cuisine
    restaurant.preview_image = restaurant_data.preview_image
    restaurant.description = restaurant_data.description

    db.commit()
    db.refresh(restaurant)

    return restaurant


@router.delete(
    "/{restaurant_id}",
    status_code=204,
    summary="Delete restaurant",
    description="Deletes a restaurant. Only its owner can perform this operation."
)
def delete_restaurant(
    restaurant_id: UUID,
    current_user: User = Depends(require_restaurant_owner),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    if restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own restaurant"
        )

    db.delete(restaurant)
    db.commit()
