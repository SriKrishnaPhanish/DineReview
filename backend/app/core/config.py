from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    # URL of the frontend application. 
    # This is used by FastAPI to configure CORS. 
    frontend_url: str

    class Config:
        env_file = ".env"


settings = Settings()