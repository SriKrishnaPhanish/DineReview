from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class RestaurantCreate(BaseModel):
    """
    Request schema used when creating a new restaurant.
    """

    restaurant_name: str = Field(
        description="Name of the restaurant"
    )

    city: str = Field(
        description="City where the restaurant is located"
    )

    cuisine: str = Field(
        description="Primary cuisine served by the restaurant"
    )

    preview_image: str | None = Field(
        default=None,
        description="URL of the restaurant's preview image"
    )

    description: str | None = Field(
        default=None,
        description="Short description of the restaurant"
    )


class RestaurantUpdate(BaseModel):
    """
    Request schema used when updating an existing restaurant.
    """

    restaurant_name: str = Field(
        description="Updated name of the restaurant"
    )

    city: str = Field(
        description="Updated city of the restaurant"
    )

    cuisine: str = Field(
        description="Updated cuisine type"
    )

    preview_image: str | None = Field(
        default=None,
        description="Updated URL of the restaurant's preview image"
    )

    description: str | None = Field(
        default=None,
        description="Updated description of the restaurant"
    )


class RestaurantResponse(BaseModel):
    """
    Response schema returned by the API when exposing restaurant data.
    """

    id: UUID = Field(
        description="Unique identifier of the restaurant"
    )

    owner_id: UUID = Field(
        description="Unique identifier of the restaurant owner"
    )

    restaurant_name: str = Field(
        description="Name of the restaurant"
    )

    city: str = Field(
        description="City where the restaurant is located"
    )

    cuisine: str = Field(
        description="Primary cuisine served by the restaurant"
    )

    preview_image: str | None = Field(
        description="URL of the restaurant's preview image"
    )

    description: str | None = Field(
        description="Short description of the restaurant"
    )

    rating_sum: int = Field(
        description="Sum of all ratings received by the restaurant"
    )

    rating_count: int = Field(
        description="Total number of reviews received by the restaurant"
    )

    average_rating: Decimal = Field(
        description="Average rating calculated from all reviews"
    )

    model_config = {
        "from_attributes": True
    }

class RestaurantListResponse(BaseModel):
    """
    Paginated response returned when fetching restaurants.

    Contains the restaurants for the current page along with
    pagination information used by the frontend for infinite scroll.
    """

    items: list[RestaurantResponse] = Field(
        description="Restaurants returned for the current page"
    )

    page: int = Field(
        description="Current page number"
    )

    limit: int = Field(
        description="Maximum number of restaurants requested per page"
    )

    has_more: bool = Field(
        description="Whether more restaurants are available on subsequent pages"
    )
