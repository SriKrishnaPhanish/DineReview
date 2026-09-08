from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole
from uuid import UUID


class UserCreate(BaseModel):
    """
    Request schema used when registering a new user.
    """

    first_name: str = Field(
        description="First name of the user"
    )
    last_name: str = Field(
        description="Last name of the user"
    )
    email: EmailStr = Field(
        description="Email address of the user"
    )
    password: str = Field(
        description="Password of the user"
    )
    role: UserRole = Field(
        description="Role selected by the user"
    )


class UserResponse(BaseModel):
    """
    Response schema returned by the API when exposing user data.
    """

    id: UUID = Field(
        description="Unique identifier of the user"
    )
    first_name: str = Field(
        description="First name of the user"
    )
    last_name: str = Field(
        description="Last name of the user"
    )
    email: EmailStr = Field(
        description="Email address of the user"
    )
    role: UserRole = Field(
        description="Role assigned to the user"
    )

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """
    Request schema used when authenticating a user.
    """

    email: EmailStr = Field(
        description="Email address of the user"
    )
    password: str = Field(
        description="Password of the user"
    )


class UserLoginResponse(BaseModel):
    """
    Response schema returned after successful authentication.
    """

    access_token: str = Field(
        description="JWT access token used for authentication"
    )
    token_type: str = Field(
        description="Type of authentication token"
    )
    user_id: UUID = Field(
        description="Unique identifier of the authenticated user"
    )
    first_name: str = Field(
        description="First name of the authenticated user"
    )
    last_name: str = Field(
        description="Last name of the authenticated user"
    )
    email: EmailStr = Field(
        description="Email address of the authenticated user"
    )
    role: UserRole = Field(
        description="Role assigned to the authenticated user"
    )
