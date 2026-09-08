function MyRestaurantCard({ restaurant, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      {restaurant.preview_image ? (
        <img
          src={restaurant.preview_image}
          alt={restaurant.restaurant_name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gray-100">
          <span className="text-gray-400">No image</span>
        </div>
      )}

      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900">
          {restaurant.restaurant_name}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {restaurant.city} • {restaurant.cuisine}
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {restaurant.description}
        </p>

        <div className="mt-4 flex items-center">
          <span className="text-yellow-500">★</span>

          <span className="ml-1 font-semibold text-gray-800">
            {restaurant.average_rating}
          </span>

          <span className="ml-1 text-sm text-gray-500">/ 5</span>

          <span className="ml-auto text-sm text-gray-500">
            {restaurant.rating_count} reviews
          </span>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => onEdit(restaurant)}
            className="flex-1 cursor-pointer rounded-lg border border-blue-600 px-4 py-2.5 font-medium text-blue-600 transition hover:bg-blue-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(restaurant)}
            className="flex-1 cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyRestaurantCard;
