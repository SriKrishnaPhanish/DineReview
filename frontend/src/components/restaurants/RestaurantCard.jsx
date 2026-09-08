import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const restaurantName = restaurant.restaurant_name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    navigate(`/restaurants/${restaurantName}?id=${restaurant.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full cursor-pointer overflow-hidden rounded-2xl bg-white text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
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
      </div>
    </button>
  );
}

export default RestaurantCard;
