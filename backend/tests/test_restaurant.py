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


def test_owner_can_create_restaurant(client):
    user = register_user(
        client,
        "owner1@example.com",
        "owner",
    )

    response = client.post(
        "/restaurants",
        json=restaurant_payload(),
        headers=auth_headers(user["access_token"]),
    )

    assert response.status_code == 201

    data = response.json()

    assert data["restaurant_name"] == "Test Restaurant"
    assert data["city"] == "Hyderabad"
    assert data["cuisine"] == "Indian"
    assert data["description"] == "A test restaurant"
    assert "id" in data


def test_reviewer_cannot_create_restaurant(client):
    user = register_user(
        client,
        "reviewer1@example.com",
        "reviewer",
    )

    response = client.post(
        "/restaurants",
        json=restaurant_payload(),
        headers=auth_headers(user["access_token"]),
    )

    assert response.status_code == 403


def test_owner_can_get_own_restaurants(client):
    user = register_user(
        client,
        "owner2@example.com",
        "owner",
    )

    create_response = client.post(
        "/restaurants",
        json=restaurant_payload("My Restaurant"),
        headers=auth_headers(user["access_token"]),
    )

    assert create_response.status_code == 201

    response = client.get(
        "/restaurants/owned",
        headers=auth_headers(user["access_token"]),
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["restaurant_name"] == "My Restaurant"


def test_owner_cannot_see_another_owners_restaurants(client):
    owner1 = register_user(
        client,
        "owner3@example.com",
        "owner",
    )

    owner2 = register_user(
        client,
        "owner4@example.com",
        "owner",
    )

    create_response = client.post(
        "/restaurants",
        json=restaurant_payload("Owner One Restaurant"),
        headers=auth_headers(owner1["access_token"]),
    )

    assert create_response.status_code == 201

    response = client.get(
        "/restaurants/owned",
        headers=auth_headers(owner2["access_token"]),
    )

    assert response.status_code == 200
    assert response.json() == []


def test_owner_can_update_own_restaurant(client):
    user = register_user(
        client,
        "owner5@example.com",
        "owner",
    )

    create_response = client.post(
        "/restaurants",
        json=restaurant_payload("Original Restaurant"),
        headers=auth_headers(user["access_token"]),
    )

    assert create_response.status_code == 201

    restaurant_id = create_response.json()["id"]

    update_payload = {
        "restaurant_name": "Updated Restaurant",
        "city": "Bangalore",
        "cuisine": "Italian",
        "preview_image": "https://example.com/updated.jpg",
        "description": "Updated description",
    }

    response = client.put(
        f"/restaurants/{restaurant_id}",
        json=update_payload,
        headers=auth_headers(user["access_token"]),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["restaurant_name"] == "Updated Restaurant"
    assert data["city"] == "Bangalore"
    assert data["cuisine"] == "Italian"
    assert data["description"] == "Updated description"


def test_owner_cannot_update_another_owners_restaurant(client):
    owner1 = register_user(
        client,
        "owner6@example.com",
        "owner",
    )

    owner2 = register_user(
        client,
        "owner7@example.com",
        "owner",
    )

    create_response = client.post(
        "/restaurants",
        json=restaurant_payload("Owner One Restaurant"),
        headers=auth_headers(owner1["access_token"]),
    )

    assert create_response.status_code == 201

    restaurant_id = create_response.json()["id"]

    update_payload = {
        "restaurant_name": "Hacked Restaurant",
        "city": "Bangalore",
        "cuisine": "Italian",
        "preview_image": "https://example.com/hacked.jpg",
        "description": "Unauthorized update",
    }

    response = client.put(
        f"/restaurants/{restaurant_id}",
        json=update_payload,
        headers=auth_headers(owner2["access_token"]),
    )

    assert response.status_code == 403

    assert response.json()["detail"] == (
        "You can only update your own restaurant"
    )


def test_owner_can_delete_own_restaurant(client):
    user = register_user(
        client,
        "owner8@example.com",
        "owner",
    )

    create_response = client.post(
        "/restaurants",
        json=restaurant_payload("Delete Me"),
        headers=auth_headers(user["access_token"]),
    )

    assert create_response.status_code == 201

    restaurant_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/restaurants/{restaurant_id}",
        headers=auth_headers(user["access_token"]),
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/restaurants/{restaurant_id}"
    )

    assert get_response.status_code == 404


def test_owner_cannot_delete_another_owners_restaurant(client):
    owner1 = register_user(
        client,
        "owner9@example.com",
        "owner",
    )

    owner2 = register_user(
        client,
        "owner10@example.com",
        "owner",
    )

    create_response = client.post(
        "/restaurants",
        json=restaurant_payload("Protected Restaurant"),
        headers=auth_headers(owner1["access_token"]),
    )

    assert create_response.status_code == 201

    restaurant_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/restaurants/{restaurant_id}",
        headers=auth_headers(owner2["access_token"]),
    )

    assert delete_response.status_code == 403

    assert delete_response.json()["detail"] == (
        "You can only delete your own restaurant"
    )


def test_get_nonexistent_restaurant(client):
    response = client.get(
        "/restaurants/00000000-0000-0000-0000-000000000000"
    )

    assert response.status_code == 404

    assert response.json()["detail"] == "Restaurant not found"


def test_unauthenticated_create_restaurant(client):
    response = client.post(
        "/restaurants",
        json=restaurant_payload(),
    )

    assert response.status_code == 401

def test_get_restaurants_default_pagination(client):
    owner = register_user(
        client,
        "pagination_owner1@example.com",
        "owner",
    )

    for i in range(3):
        response = client.post(
            "/restaurants",
            json=restaurant_payload(f"Restaurant {i + 1}"),
            headers=auth_headers(owner["access_token"]),
        )

        assert response.status_code == 201

    response = client.get("/restaurants")

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert "page" in data
    assert "limit" in data
    assert "has_more" in data

    assert data["page"] == 1
    assert data["limit"] == 10
    assert len(data["items"]) == 3
    assert data["has_more"] is False


def test_get_restaurants_with_custom_limit(client):
    owner = register_user(
        client,
        "pagination_owner2@example.com",
        "owner",
    )

    for i in range(5):
        response = client.post(
            "/restaurants",
            json=restaurant_payload(f"Restaurant {i + 1}"),
            headers=auth_headers(owner["access_token"]),
        )

        assert response.status_code == 201

    response = client.get(
        "/restaurants?page=1&limit=2"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["page"] == 1
    assert data["limit"] == 2
    assert len(data["items"]) == 2
    assert data["has_more"] is True


def test_get_restaurants_second_page(client):
    owner = register_user(
        client,
        "pagination_owner3@example.com",
        "owner",
    )

    for i in range(5):
        response = client.post(
            "/restaurants",
            json=restaurant_payload(f"Restaurant {i + 1}"),
            headers=auth_headers(owner["access_token"]),
        )

        assert response.status_code == 201

    first_page = client.get(
        "/restaurants?page=1&limit=2"
    )

    second_page = client.get(
        "/restaurants?page=2&limit=2"
    )

    assert first_page.status_code == 200
    assert second_page.status_code == 200

    first_data = first_page.json()
    second_data = second_page.json()

    assert first_data["page"] == 1
    assert second_data["page"] == 2

    assert len(first_data["items"]) == 2
    assert len(second_data["items"]) == 2

    first_ids = {
        restaurant["id"]
        for restaurant in first_data["items"]
    }

    second_ids = {
        restaurant["id"]
        for restaurant in second_data["items"]
    }

    assert first_ids.isdisjoint(second_ids)


def test_get_restaurants_has_more_false_on_last_page(client):
    owner = register_user(
        client,
        "pagination_owner4@example.com",
        "owner",
    )

    for i in range(4):
        response = client.post(
            "/restaurants",
            json=restaurant_payload(f"Restaurant {i + 1}"),
            headers=auth_headers(owner["access_token"]),
        )

        assert response.status_code == 201

    response = client.get(
        "/restaurants?page=2&limit=2"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["page"] == 2
    assert data["limit"] == 2
    assert len(data["items"]) == 2
    assert data["has_more"] is False


def test_get_restaurants_pagination_with_city_filter(client):
    owner = register_user(
        client,
        "pagination_owner5@example.com",
        "owner",
    )

    for i in range(3):
        response = client.post(
            "/restaurants",
            json=restaurant_payload(f"Hyderabad Restaurant {i + 1}"),
            headers=auth_headers(owner["access_token"]),
        )

        assert response.status_code == 201

    bangalore_payload = restaurant_payload("Bangalore Restaurant")
    bangalore_payload["city"] = "Bangalore"

    response = client.post(
        "/restaurants",
        json=bangalore_payload,
        headers=auth_headers(owner["access_token"]),
    )

    assert response.status_code == 201

    response = client.get(
        "/restaurants?city=Hyderabad&page=1&limit=2"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["page"] == 1
    assert data["limit"] == 2
    assert len(data["items"]) == 2
    assert data["has_more"] is True

    for restaurant in data["items"]:
        assert restaurant["city"] == "Hyderabad"


def test_get_restaurants_invalid_page(client):
    response = client.get(
        "/restaurants?page=0"
    )

    assert response.status_code == 422


def test_get_restaurants_invalid_limit(client):
    response = client.get(
        "/restaurants?limit=0"
    )

    assert response.status_code == 422
