import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";
import NavBar from "../components/common/NavBar";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewForm from "../components/reviews/ReviewForm";

function RestaurantDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const restaurantId = searchParams.get("id");

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [reviewsError, setReviewsError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const isReviewer = user?.role === "reviewer";

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}`);

      setRestaurant(response.data);
    } catch (error) {
      console.error("Failed to fetch restaurant:", error);

      if (error.response) {
        setError(error.response.data.detail || "Failed to load restaurant");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError("");

      const response = await api.get(`/reviews/restaurant/${restaurantId}`);

      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);

      if (error.response) {
        setReviewsError(error.response.data.detail || "Failed to load reviews");
      } else {
        setReviewsError("Unable to load reviews");
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant?.restaurant_name) {
      document.title = `${restaurant.restaurant_name} | DineReview`;
    } else {
      document.title = "Restaurant | DineReview";
    }

    if (!restaurantId) {
      setError("Restaurant ID is missing");
      setLoading(false);
      setReviewsLoading(false);
      return;
    }

    fetchRestaurant();
    fetchReviews();
  }, [restaurantId, restaurant?.restaurant_name]);

  const handleReviewSubmit = async (reviewData) => {
    setReviewError("");
    setReviewSuccess("");
    setReviewSubmitting(true);

    try {
      await api.post("/reviews", {
        restaurant_id: restaurantId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      setReviewSuccess("Review submitted successfully!");

      await Promise.all([fetchRestaurant(), fetchReviews()]);
    } catch (error) {
      console.error("Failed to submit review:", error);

      if (error.response) {
        setReviewError(error.response.data.detail || "Failed to submit review");
      } else {
        setReviewError("Unable to connect to the server");
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />

        <main className="px-6 py-10">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => navigate("/restaurants")}
                className="mt-5 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                Back to Restaurants
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}

          <button
            type="button"
            onClick={() => navigate("/restaurants")}
            className="mb-6 cursor-pointer text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Restaurants
          </button>

          {/* Restaurant Details */}

          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            {restaurant.preview_image ? (
              <img
                src={restaurant.preview_image}
                alt={restaurant.restaurant_name}
                className="h-80 w-full object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image available</span>
              </div>
            )}

            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900">
                {restaurant.restaurant_name}
              </h1>

              <p className="mt-2 text-gray-500">
                {restaurant.city} • {restaurant.cuisine}
              </p>

              {restaurant.description && (
                <p className="mt-6 leading-7 text-gray-600">
                  {restaurant.description}
                </p>
              )}

              <div className="mt-6 flex items-center border-t border-gray-200 pt-6">
                <span className="text-2xl text-yellow-500">★</span>

                <span className="ml-2 text-xl font-semibold text-gray-900">
                  {restaurant.average_rating}
                </span>

                <span className="ml-1 text-gray-500">/ 5</span>

                <span className="ml-auto text-gray-500">
                  {restaurant.rating_count} reviews
                </span>
              </div>
            </div>
          </div>

          {/* Reviews */}

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>

              <span className="text-sm text-gray-500">
                {reviews.length} reviews
              </span>
            </div>

            {reviewsLoading ? (
              <div className="mt-6">
                <p className="text-gray-500">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="mt-6 rounded-lg bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{reviewsError}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center">
                <p className="text-gray-500">No reviews yet.</p>
              </div>
            ) : (
              <div className="mt-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

          {/* Write Review */}

          {isReviewer && (
            <div className="mt-8">
              {reviewError && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-600">
                    {reviewError}
                  </p>
                </div>
              )}

              {reviewSuccess && (
                <div className="mb-4 rounded-lg bg-green-50 px-4 py-3">
                  <p className="text-sm font-medium text-green-600">
                    {reviewSuccess}
                  </p>
                </div>
              )}

              <ReviewForm
                onSubmit={handleReviewSubmit}
                loading={reviewSubmitting}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RestaurantDetails;
