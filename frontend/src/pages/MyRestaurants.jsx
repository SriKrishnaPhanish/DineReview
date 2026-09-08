import { useEffect, useState } from "react";
import NavBar from "../components/common/NavBar";
import RestaurantForm from "../components/restaurants/RestaurantForm";
import MyRestaurantCard from "../components/restaurants/MyRestaurantCard";
import DeleteRestaurantModal from "../components/restaurants/DeleteRestaurantModal";
import api from "../services/api";

function MyRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  const [error, setError] = useState("");

  const fetchMyRestaurants = async () => {
    setError("");

    try {
      const response = await api.get("/restaurants/owned");

      setRestaurants(response.data);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);

      if (error.response) {
        setError(error.response.data.detail || "Failed to load restaurants");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  const handleAdd = () => {
    setSelectedRestaurant(null);
    setShowForm(true);
  };

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowForm(true);
  };

  const handleSubmit = async (restaurantData) => {
    setError("");
    setSaving(true);

    try {
      if (selectedRestaurant) {
        // UPDATE
        await api.put(`/restaurants/${selectedRestaurant.id}`, restaurantData);
      } else {
        // CREATE
        await api.post("/restaurants", restaurantData);
      }

      setShowForm(false);
      setSelectedRestaurant(null);

      await fetchMyRestaurants();
    } catch (error) {
      console.error("Failed to save restaurant:", error);

      if (error.response) {
        setError(error.response.data.detail || "Failed to save restaurant");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (restaurant) => {
    setRestaurantToDelete(restaurant);
  };

  const confirmDelete = async () => {
    if (!restaurantToDelete) {
      return;
    }

    setError("");

    try {
      await api.delete(`/restaurants/${restaurantToDelete.id}`);

      setRestaurantToDelete(null);

      await fetchMyRestaurants();
    } catch (error) {
      console.error("Failed to delete restaurant:", error);

      if (error.response) {
        setError(error.response.data.detail || "Failed to delete restaurant");
      } else {
        setError("Unable to connect to the server");
      }
    }
  };

  const cancelDelete = () => {
    setRestaurantToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-gray-600">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                My Restaurants
              </h1>

              <p className="mt-2 text-gray-500">
                Manage the restaurants you own.
              </p>
            </div>

            {!showForm && (
              <button
                type="button"
                onClick={handleAdd}
                className="cursor-pointer rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                + Add Restaurant
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Add / Edit Form */}
          {showForm ? (
            <div className="mx-auto max-w-2xl">
              <RestaurantForm
                restaurant={selectedRestaurant}
                onSubmit={handleSubmit}
                onCancel={() => {
                  if (saving) {
                    return;
                  }

                  setShowForm(false);
                  setSelectedRestaurant(null);
                }}
                loading={saving}
              />
            </div>
          ) : (
            <>
              {restaurants.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                  <p className="text-gray-500">
                    You haven't added any restaurants yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {restaurants.map((restaurant) => (
                    <MyRestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation */}
      <DeleteRestaurantModal
        restaurant={restaurantToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default MyRestaurants;
