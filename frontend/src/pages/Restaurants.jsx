import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import RestaurantCard from "../components/restaurants/RestaurantCard";
import RestaurantFilters from "../components/restaurants/RestaurantFilters";
import NavBar from "../components/common/NavBar";

function Restaurants() {
  // Stores all restaurants currently displayed on the page.
  // When a new page is loaded, new restaurants are appended here.
  const [restaurants, setRestaurants] = useState([]);

  // Used while loading the initial restaurant list.
  const [loading, setLoading] = useState(true);

  // Used when the user applies or clears filters.
  const [filterLoading, setFilterLoading] = useState(false);

  // Used when loading the next page during infinite scroll.
  const [loadingMore, setLoadingMore] = useState(false);

  // Keeps track of the currently loaded page.
  const [page, setPage] = useState(1);

  // Backend tells us whether another page is available.
  const [hasMore, setHasMore] = useState(true);

  // Filter values.
  const [city, setCity] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");

  // Stores API/network error messages.
  const [error, setError] = useState("");

  /*
   * Reference to the IntersectionObserver.
   *
   * The observer watches an element at the bottom of the
   * restaurant list and triggers the next API request when
   * that element enters the viewport.
   */
  const observerRef = useRef(null);

  /*
   * Fetch restaurants from the backend.
   *
   * filters:
   *   Current filter values.
   *
   * pageNumber:
   *   Page that should be fetched.
   *
   * isFiltering:
   *   Indicates that the request was triggered by applying
   *   or clearing filters.
   */
  const fetchRestaurants = async (
    filters = {},
    pageNumber = 1,
    isFiltering = false,
  ) => {
    try {
      setError("");

      // Choose the appropriate loading state depending
      // on what caused the API request.
      if (isFiltering) {
        setFilterLoading(true);
      } else if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      /*
       * Pagination parameters sent to the backend.
       *
       * Example:
       * /restaurants?page=2&limit=10
       */
      const params = {
        page: pageNumber,
        limit: 10,
      };

      // Add filters only when the user has provided a value.
      if (filters.city?.trim()) {
        params.city = filters.city.trim();
      }

      if (filters.cuisine?.trim()) {
        params.cuisine = filters.cuisine.trim();
      }

      if (filters.minRating !== "") {
        params.min_rating = filters.minRating;
      }

      if (filters.maxRating !== "") {
        params.max_rating = filters.maxRating;
      }

      // Send the request to the backend.
      const response = await api.get("/restaurants", {
        params,
      });

      const data = response.data;

      /*
       * Page 1 replaces the existing list.
       *
       * Pages 2, 3, etc. are appended to the existing list
       * because infinite scroll should preserve restaurants
       * that have already been displayed.
       */
      if (pageNumber === 1) {
        setRestaurants(data.items);
      } else {
        setRestaurants((previousRestaurants) => [
          ...previousRestaurants,
          ...data.items,
        ]);
      }

      /*
       * Update pagination information returned by the backend.
       */
      setPage(data.page);
      setHasMore(data.has_more);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);

      // Display a useful error message to the user.
      if (error.response) {
        setError(error.response.data.detail || "Failed to load restaurants");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      // Reset all loading states after the request completes.
      setLoading(false);
      setFilterLoading(false);
      setLoadingMore(false);
    }
  };

  /*
   * Initial page load.
   *
   * Fetches the first 10 restaurants when the component
   * is mounted.
   */
  useEffect(() => {
    document.title = "Restaurants | DineReview";

    fetchRestaurants();
  }, []);

  /*
   * Called when the user clicks "Apply".
   *
   * Since the filters have changed, we must start again
   * from page 1.
   */
  const handleApplyFilters = () => {
    setRestaurants([]);
    setPage(1);
    setHasMore(true);

    fetchRestaurants(
      {
        city,
        cuisine,
        minRating,
        maxRating,
      },
      1,
      true,
    );
  };

  /*
   * Called when the user clicks "Clear".
   *
   * Reset all filter values and start fetching again
   * from page 1.
   */
  const handleClearFilters = () => {
    setCity("");
    setCuisine("");
    setMinRating("");
    setMaxRating("");

    setRestaurants([]);
    setPage(1);
    setHasMore(true);

    fetchRestaurants({}, 1, true);
  };

  /*
   * Loads the next page of restaurants.
   *
   * We do nothing if:
   * - Another request is already running.
   * - The backend says there are no more restaurants.
   * - A filter request is currently running.
   */
  const loadMoreRestaurants = () => {
    if (loadingMore || !hasMore || filterLoading) {
      return;
    }

    fetchRestaurants(
      {
        city,
        cuisine,
        minRating,
        maxRating,
      },
      page + 1,
    );
  };

  /*
   * IntersectionObserver watches the element at the bottom
   * of the restaurant list.
   *
   * When the element becomes visible, we load the next page.
   *
   * This is preferable to listening to the window's scroll
   * event because the browser efficiently handles visibility
   * detection for us.
   */
  const loadMoreRef = (node) => {
    // Don't create another observer while loading.
    if (loadingMore) {
      return;
    }

    /*
     * Disconnect the previous observer before creating
     * a new one.
     */
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // The bottom element has entered the viewport.
        if (entries[0].isIntersecting) {
          loadMoreRestaurants();
        }
      },
      {
        // Observer triggers when approximately 10% of
        // the target element is visible.
        threshold: 0.1,
      },
    );

    // Start observing the bottom element.
    if (node) {
      observerRef.current.observe(node);
    }
  };

  /*
   * Initial loading state.
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Restaurants</h1>

            <p className="mt-2 text-gray-500">
              Discover restaurants and see what people are saying.
            </p>
          </div>

          {/* Restaurant Filters */}
          <RestaurantFilters
            city={city}
            cuisine={cuisine}
            minRating={minRating}
            maxRating={maxRating}
            onCityChange={setCity}
            onCuisineChange={setCuisine}
            onMinRatingChange={setMinRating}
            onMaxRatingChange={setMaxRating}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            loading={filterLoading}
          />

          {/* API Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Restaurant List */}
          {filterLoading ? (
            /*
             * Show this while a filter request is running.
             */
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-gray-600">Applying filters...</p>
            </div>
          ) : restaurants.length === 0 ? (
            /*
             * No restaurants were returned by the backend.
             */
            <div className="rounded-xl bg-white p-8 text-center shadow">
              <p className="text-gray-500">
                No restaurants found matching your filters.
              </p>
            </div>
          ) : (
            <>
              {/* Restaurant Cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>

              {/*
               * Infinite Scroll Trigger
               *
               * This invisible/empty element sits below the
               * restaurant cards.
               *
               * When it enters the viewport, IntersectionObserver
               * calls loadMoreRestaurants().
               */}
              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex min-h-[100px] items-center justify-center"
                >
                  {loadingMore && (
                    <p className="text-gray-600">Loading more restaurants...</p>
                  )}
                </div>
              )}

              {/*
               * Displayed when the backend tells us that
               * there are no more pages to load.
               */}
              {!hasMore && (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">
                    You've reached the end of the restaurants.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Restaurants;
