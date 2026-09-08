from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID


class ReviewCreate(BaseModel):
    """
    Request schema used when creating a new restaurant review.
    """

    restaurant_id: UUID = Field(
        description="Unique identifier of the restaurant"
    )
    rating: int = Field(
        ...,
        ge=1,
        le=5,
        description="Rating given to the restaurant from 1 to 5"
    )
    comment: str | None = Field(
        default=None,
        description="Optional comment about the restaurant"
    )


class ReviewResponse(BaseModel):
    """
    Response schema returned by the API when exposing review data.
    """

    id: UUID = Field(
        description="Unique identifier of the review"
    )
    user_id: UUID = Field(
        description="Unique identifier of the reviewer"
    )
    restaurant_id: UUID = Field(
        description="Unique identifier of the reviewed restaurant"
    )
    rating: int = Field(
        description="Rating given to the restaurant from 1 to 5"
    )
    comment: str | None = Field(
        description="Reviewer's comment"
    )
    created_at: datetime = Field(
        description="Date and time when the review was created"
    )

    reviewer_first_name: str = Field(
        description="First name of the reviewer"
    )
    reviewer_last_name: str = Field(
        description="Last name of the reviewer"
    )

    model_config = {
        "from_attributes": True
    }
