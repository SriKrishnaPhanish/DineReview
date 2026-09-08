function RestaurantFilters({
  city,
  cuisine,
  minRating,
  maxRating,
  onCityChange,
  onCuisineChange,
  onMinRatingChange,
  onMaxRatingChange,
  onApply,
  onClear,
  loading = false,
}) {
  return (
    <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-5">
        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            placeholder="e.g. Hyderabad"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        {/* Cuisine */}
        <div>
          <label
            htmlFor="cuisine"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Cuisine
          </label>

          <input
            id="cuisine"
            type="text"
            value={cuisine}
            onChange={(event) => onCuisineChange(event.target.value)}
            placeholder="e.g. Indian"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        {/* Minimum Rating */}
        <div>
          <label
            htmlFor="minRating"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Min Rating
          </label>

          <select
            id="minRating"
            value={minRating}
            onChange={(event) => onMinRatingChange(event.target.value)}
            disabled={loading}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">Any</option>
            <option value="1">1 ★</option>
            <option value="2">2 ★</option>
            <option value="3">3 ★</option>
            <option value="4">4 ★</option>
            <option value="5">5 ★</option>
          </select>
        </div>

        {/* Maximum Rating */}
        <div>
          <label
            htmlFor="maxRating"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Max Rating
          </label>

          <select
            id="maxRating"
            value={maxRating}
            onChange={(event) => onMaxRatingChange(event.target.value)}
            disabled={loading}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">Any</option>
            <option value="1">1 ★</option>
            <option value="2">2 ★</option>
            <option value="3">3 ★</option>
            <option value="4">4 ★</option>
            <option value="5">5 ★</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={onApply}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white transition ${
              loading
                ? "cursor-not-allowed bg-blue-400"
                : "cursor-pointer bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
            )}

            <span>{loading ? "Applying..." : "Apply"}</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className={`flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition ${
              loading
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-gray-50"
            }`}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantFilters;
