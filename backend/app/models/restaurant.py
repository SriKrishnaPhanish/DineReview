from datetime import datetime
import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from sqlalchemy.orm import relationship

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    owner_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    city = Column(String(100), nullable=False)
    cuisine = Column(String(100), nullable=False)

    restaurant_name = Column(
        String(200),
        nullable=False
    )

    preview_image = Column(
        Text,
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    rating_sum = Column(
        Integer,
        default=0,
        nullable=False
    )

    rating_count = Column(
        Integer,
        default=0,
        nullable=False
    )

    average_rating = Column(
        Numeric(3, 2),
        default=0.00,
        nullable=False
    )

    owner = relationship("User",back_populates="restaurants")
    reviews = relationship("Review", back_populates="restaurant")