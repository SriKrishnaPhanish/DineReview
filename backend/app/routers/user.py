import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    UserLoginResponse,
)
from app.models import User
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post(
    "/register",
    response_model=UserLoginResponse,
    status_code=201,
    summary="Register a user",
    description=(
        "Creates a new user account and returns an access token. "
        "Users can register as either a reviewer or restaurant owner."
    )
)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    logger.info(
        "Registration attempt for email: %s",
        user_data.email
    )

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        logger.warning(
            "Registration failed - email already exists: %s",
            user_data.email
        )

        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password=hash_password(user_data.password),
        role=user_data.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(
        str(user.id)
    )

    logger.info(
        "User registered successfully: id=%s, email=%s",
        user.id,
        user.email
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role
    }


@router.post(
    "/login",
    response_model=UserLoginResponse,
    summary="Login user",
    description=(
        "Authenticates a user using their email and password "
        "and returns an access token."
    )
)
def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    logger.info(
        "Login attempt for email: %s",
        user_data.email
    )

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        logger.warning(
            "Login failed - user not found: %s",
            user_data.email
        )

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        user_data.password,
        user.password
    ):
        logger.warning(
            "Login failed - invalid password for: %s",
            user_data.email
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    access_token = create_access_token(
        str(user.id)
    )

    logger.info(
        "Login successful: id=%s, email=%s",
        user.id,
        user.email
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role
    }
