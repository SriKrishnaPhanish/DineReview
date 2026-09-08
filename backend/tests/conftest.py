import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from fastapi.testclient import TestClient

from app.main import app
from app.core.database import Base, get_db


# -----------------------------------
# Test Database
# -----------------------------------

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"


test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "check_same_thread": False
    },
    poolclass=StaticPool,
)


TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)


# -----------------------------------
# Override Database Dependency
# -----------------------------------

def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


# -----------------------------------
# Test Client Fixture
# -----------------------------------

@pytest.fixture
def client():
    Base.metadata.create_all(bind=test_engine)

    try:
        yield TestClient(app)
    finally:
        Base.metadata.drop_all(bind=test_engine)


# -----------------------------------
# Database Session Fixture
# -----------------------------------

@pytest.fixture
def db():
    Base.metadata.create_all(bind=test_engine)

    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)
