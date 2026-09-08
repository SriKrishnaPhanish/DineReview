def register_user(client, email, role):
    response = client.post(
        "/users/register",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": email,
            "password": "password123",
            "role": role,
        },
    )

    assert response.status_code == 201

    return response.json()


def auth_headers(access_token):
    return {
        "Authorization": f"Bearer {access_token}"
    }


def restaurant_payload(name="Test Restaurant"):
    return {
        "restaurant_name": name,
        "city": "Hyderabad",
        "cuisine": "Indian",
        "preview_image": "https://example.com/image.jpg",
        "description": "A test restaurant",
    }


def create_restaurant(client, owner_token, name="Test Restaurant"):
    response = client.post(
        "/restaurants",
        json=restaurant_payload(name),
        headers=auth_headers(owner_token),
    )

    assert response.status_code == 201

    return response.json()


def review_payload(restaurant_id, rating=5, comment="Great food!"):
    return {
        "restaurant_id": restaurant_id,
        "rating": rating,
        "comment": comment,
    }


def test_reviewer_can_create_review(client):
    owner = register_user(
        client,
        "review_owner1@example.com",
        "owner",
    )

    reviewer = register_user(
        client,
        "reviewer1@example.com",
        "reviewer",
    )

    restaurant = create_restaurant(
        client,
        owner["access_token"],
    )

    response = client.post(
        "/reviews",
        json=review_payload(
            restaurant["id"],
            rating=5,
            comment="Excellent restaurant!",
        ),
        headers=auth_headers(reviewer["access_token"]),
    )

    assert response.status_code == 201

    data = response.json()

    assert data["restaurant_id"] == restaurant["id"]
    assert data["user_id"] == reviewer["user_id"]
    assert data["rating"] == 5
    assert data["comment"] == "Excellent restaurant!"
    assert data["reviewer_first_name"] == "Test"
    assert data["reviewer_last_name"] == "User"
    assert "id" in data
    assert "created_at" in data


def test_owner_cannot_create_review(client):
    owner = register_user(
        client,
        "review_owner2@example.com",
        "owner",
    )

    restaurant = create_restaurant(
        client,
        owner["access_token"],
    )

    response = client.post(
        "/reviews",
        json=review_payload(restaurant["id"]),
        headers=auth_headers(owner["access_token"]),
    )

    assert response.status_code == 403

    assert response.json()["detail"] == (
        "Only reviewers can write reviews"
    )


def test_unauthenticated_user_cannot_create_review(client):
    owner = register_user(
        client,
        "review_owner3@example.com",
        "owner",
    )

    restaurant = create_restaurant(
        client,
        owner["access_token"],
    )

    response = client.post(
        "/reviews",
        json=review_payload(restaurant["id"]),
    )

    assert response.status_code == 401


def test_review_restaurant_that_does_not_exist(client):
    reviewer = register_user(
        client,
        "reviewer2@example.com",
        "reviewer",
    )

    response = client.post(
        "/reviews",
        json=review_payload(
            "00000000-0000-0000-0000-000000000000"
        ),
        headers=auth_headers(reviewer["access_token"]),
    )

    assert response.status_code == 404

    assert response.json()["detail"] == "Restaurant not found"


def test_reviewer_cannot_review_same_restaurant_twice(client):
    owner = register_user(
        client,
        "review_owner4@example.com",
        "owner",
    )

    reviewer = register_user(
        client,
        "reviewer3@example.com",
        "reviewer",
    )

    restaurant = create_restaurant(
        client,
        owner["access_token"],
    )

    first_response = client.post(
        "/reviews",
        json=review_payload(
            restaurant["id"],
            rating=5,
            comment="First review",
        ),
        headers=auth_headers(reviewer["access_token"]),
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/reviews",
        json=review_payload(
            restaurant["id"],
            rating=4,
            comment="Second review",
        ),
        headers=auth_headers(reviewer["access_token"]),
    )

    assert second_response.status_code == 409

    assert second_response.json()["detail"] == (
        "You have already reviewed this restaurant"
    )


def test_rating_below_one_is_rejected(client):
    owner = register_user(
        client,
        "review_owner5@example.com",
        "owner",
    )

    reviewer = register_user(
        client,
        "reviewer4@example.com",
        "reviewer",
    )

    restaurant = create_restaurant(
        client,
        owner["access_token"],
    )

    response = client.post(
        "/reviews",
        json=review_payload(
            restaurant["id"],
            rating=0,
        ),
        headers=auth_headers(reviewer["access_token"]),
    )

    assert response.status_code == 422


def test_rating_above_five_is_rejected(client):
    owner = register_user(
        client,
        "review_owner6@example.com",
        "owner",
    )

    reviewer = register_user(
        client,
        "reviewer5@example.com",
        "reviewer",
    )

    restaurant = create_restaurant(
        client,
        owner["access_token"],
    )

    response = client.post(
        "/reviews",
        json=review_payload(
            restaurant["id"],
            rating=6,
        ),
        headers=auth_headers(reviewer["access_token"]),
    )

    assert response.status_code == 422


def test_restaurant_rating_is_updated_after_review(client):
    owner = register_user(
        client,
        "review_owner7@example.com",
        "owner",
    )

    reviewer1 = register_user(
        client,
        "reviewer6@example.com",
        "reviewer",
    )

    reviewer2 = register_user(
        client,
        "reviewer7@example.com",
        "reviewer",
    )

    restaurant = create_restaurant(
        client,
        owner["access_token"],
    )

    first_response = client.post(
        "/reviews",
        json=review_payload(
            restaurant["id"],
            rating=5,
        ),
        headers=auth_headers(reviewer1["access_token"]),
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/reviews",
        json=review_payload(
            restaurant["id"],
            rating=3,
        ),
        headers=auth_headers(reviewer2["access_token"]),
    )

    assert second_response.status_code == 201

    restaurant_response = client.get(
        f"/restaurants/{restaurant['id']}"
    )

    assert restaurant_response.status_code == 200

    data = restaurant_response.json()

    assert data["rating_sum"] == 8
    assert data["rating_count"] == 2
    assert float(data["average_rating"]) == 4.0


def test_get_restaurant_reviews(client):
    owner = register_user(
        client,
        "review_owner8@example.com",
        "owner",
    )

    reviewer = register_user(
        client,
        "reviewer8@example.com",
        "reviewer",
    )

    restaurant = create_restaurant(
        client,
        owner["access_token"],
    )

    create_response = client.post(
        "/reviews",
        json=review_payload(
            restaurant["id"],
            rating=4,
            comment="Very good!",
        ),
        headers=auth_headers(reviewer["access_token"]),
    )

    assert create_response.status_code == 201

    response = client.get(
        f"/reviews/restaurant/{restaurant['id']}"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["restaurant_id"] == restaurant["id"]
    assert data[0]["rating"] == 4
    assert data[0]["comment"] == "Very good!"
    assert data[0]["reviewer_first_name"] == "Test"
    assert data[0]["reviewer_last_name"] == "User"


def test_get_reviews_for_nonexistent_restaurant(client):
    response = client.get(
        "/reviews/restaurant/"
        "00000000-0000-0000-0000-000000000000"
    )

    assert response.status_code == 404

    assert response.json()["detail"] == "Restaurant not found"
