def test_register_reviewer(client):
    response = client.post(
        "/users/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "password": "password123",
            "role": "reviewer",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert data["email"] == "john@example.com"
    assert data["role"] == "reviewer"

    assert "access_token" in data
    assert data["token_type"] == "bearer"

    assert "password" not in data


def test_register_owner(client):
    response = client.post(
        "/users/register",
        json={
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "password": "password123",
            "role": "owner",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["first_name"] == "Jane"
    assert data["last_name"] == "Smith"
    assert data["email"] == "jane@example.com"
    assert data["role"] == "owner"

    assert "access_token" in data
    assert data["token_type"] == "bearer"

    assert "password" not in data


def test_register_duplicate_email(client):
    user = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "duplicate@example.com",
        "password": "password123",
        "role": "reviewer",
    }

    first_response = client.post(
        "/users/register",
        json=user,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/users/register",
        json=user,
    )

    assert second_response.status_code == 409

    assert second_response.json()["detail"] == (
        "Email already registered"
    )

def test_register_reviewer(client):
    response = client.post(
        "/users/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "password": "password123",
            "role": "reviewer",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert data["email"] == "john@example.com"
    assert data["role"] == "reviewer"

    assert "access_token" in data
    assert data["token_type"] == "bearer"

    assert "password" not in data


def test_register_owner(client):
    response = client.post(
        "/users/register",
        json={
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "password": "password123",
            "role": "owner",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["first_name"] == "Jane"
    assert data["last_name"] == "Smith"
    assert data["email"] == "jane@example.com"
    assert data["role"] == "owner"

    assert "access_token" in data
    assert data["token_type"] == "bearer"

    assert "password" not in data


def test_register_duplicate_email(client):
    user = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "duplicate@example.com",
        "password": "password123",
        "role": "reviewer",
    }

    first_response = client.post(
        "/users/register",
        json=user,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/users/register",
        json=user,
    )

    assert second_response.status_code == 409

    assert second_response.json()["detail"] == (
        "Email already registered"
    )


def test_login_success(client):
    client.post(
        "/users/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "login@example.com",
            "password": "password123",
            "role": "reviewer",
        },
    )

    response = client.post(
        "/users/login",
        json={
            "email": "login@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == "login@example.com"
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert data["role"] == "reviewer"

    assert "access_token" in data
    assert data["token_type"] == "bearer"

    assert "password" not in data


def test_login_user_not_found(client):
    response = client.post(
        "/users/login",
        json={
            "email": "doesnotexist@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 404

    assert response.json()["detail"] == "User not found"


def test_login_invalid_password(client):
    client.post(
        "/users/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "wrongpassword@example.com",
            "password": "password123",
            "role": "reviewer",
        },
    )

    response = client.post(
        "/users/login",
        json={
            "email": "wrongpassword@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401

    assert response.json()["detail"] == "Invalid password"

def test_register_invalid_email(client):
    response = client.post(
        "/users/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "invalid-email",
            "password": "password123",
            "role": "reviewer",
        },
    )

    assert response.status_code == 422


def test_register_missing_required_field(client):
    response = client.post(
        "/users/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "missing@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 422


def test_register_invalid_role(client):
    response = client.post(
        "/users/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "invalidrole@example.com",
            "password": "password123",
            "role": "admin",
        },
    )

    assert response.status_code == 422


def test_login_invalid_email(client):
    response = client.post(
        "/users/login",
        json={
            "email": "invalid-email",
            "password": "password123",
        },
    )

    assert response.status_code == 422


def test_login_missing_password(client):
    response = client.post(
        "/users/login",
        json={
            "email": "test@example.com",
        },
    )

    assert response.status_code == 422
