from datetime import datetime, timezone, timedelta
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

import logging


logger = logging.getLogger(__name__)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

security = HTTPBearer()


def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.jwt_access_token_expire_minutes
    )

    payload = {
        "sub": user_id,
        "exp": expire
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )

        user_id = payload.get("sub")

        if user_id is None:
            logger.warning(
                "JWT validation failed - user_id missing"
            )
            raise credentials_exception

        try:
            user_uuid = UUID(user_id)
        except (ValueError, AttributeError, TypeError):
            logger.warning(
                "JWT validation failed - invalid user_id: %s",
                user_id
            )
            raise credentials_exception

    except JWTError:
        logger.warning(
            "JWT validation failed - invalid or expired token"
        )
        raise credentials_exception

    user = db.query(User).filter(
        User.id == user_uuid
    ).first()

    if user is None:
        logger.warning(
            "JWT validation failed - user not found: %s",
            user_uuid
        )
        raise credentials_exception

    logger.info(
        "Authenticated user successfully: id=%s, email=%s",
        user.id,
        user.email
    )

    return user


def require_restaurant_owner(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "owner":
        logger.warning(
            "Restaurant owner access denied: user_id=%s, role=%s",
            current_user.id,
            current_user.role
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only restaurant owners can perform this action"
        )

    return current_user


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )
