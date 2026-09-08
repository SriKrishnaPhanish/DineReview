import { useEffect, useState } from "react";

function RestaurantForm({
  restaurant = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [restaurantName, setRestaurantName] = useState("");
  const [city, setCity] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});

  const isEditMode = restaurant !== null;

  useEffect(() => {
    if (restaurant) {
      setRestaurantName(restaurant.restaurant_name || "");
      setCity(restaurant.city || "");
      setCuisine(restaurant.cuisine || "");
      setPreviewImage(restaurant.preview_image || "");
      setDescription(restaurant.description || "");
      setErrors({});
    } else {
      setRestaurantName("");
      setCity("");
      setCuisine("");
      setPreviewImage("");
      setDescription("");
      setErrors({});
    }
  }, [restaurant]);

  const validateForm = () => {
    const newErrors = {};

    const trimmedRestaurantName = restaurantName.trim();
    const trimmedCity = city.trim();
    const trimmedCuisine = cuisine.trim();
    const trimmedPreviewImage = previewImage.trim();
    const trimmedDescription = description.trim();

    // Restaurant name
    if (!trimmedRestaurantName) {
      newErrors.restaurantName = "Restaurant name is required";
    } else if (trimmedRestaurantName.length < 2) {
      newErrors.restaurantName =
        "Restaurant name must be at least 2 characters";
    } else if (trimmedRestaurantName.length > 100) {
      newErrors.restaurantName =
        "Restaurant name must not exceed 100 characters";
    }

    // City
    if (!trimmedCity) {
      newErrors.city = "City is required";
    } else if (trimmedCity.length < 2) {
      newErrors.city = "City must be at least 2 characters";
    } else if (trimmedCity.length > 50) {
      newErrors.city = "City must not exceed 50 characters";
    }

    // Cuisine
    if (!trimmedCuisine) {
      newErrors.cuisine = "Cuisine is required";
    } else if (trimmedCuisine.length < 2) {
      newErrors.cuisine = "Cuisine must be at least 2 characters";
    } else if (trimmedCuisine.length > 50) {
      newErrors.cuisine = "Cuisine must not exceed 50 characters";
    }

    // Preview image
    if (trimmedPreviewImage) {
      try {
        const url = new URL(trimmedPreviewImage);

        if (!["http:", "https:"].includes(url.protocol)) {
          newErrors.previewImage = "Please enter a valid image URL";
        }
      } catch {
        newErrors.previewImage = "Please enter a valid image URL";
      }
    }

    // Description
    if (trimmedDescription.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    if (loading) {
      return;
    }

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    onSubmit({
      restaurant_name: restaurantName.trim(),
      city: city.trim(),
      cuisine: cuisine.trim(),
      preview_image: previewImage.trim(),
      description: description.trim(),
    });
  };

  const handleFieldChange = (field, value, setter) => {
    setter(value);

    if (errors[field]) {
      setErrors((previousErrors) => {
        const updatedErrors = { ...previousErrors };
        delete updatedErrors[field];

        return updatedErrors;
      });
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">
        {isEditMode ? "Edit Restaurant" : "Add Restaurant"}
      </h2>

      <div className="mt-6 space-y-5">
        {/* Restaurant Name */}
        <div>
          <label
            htmlFor="restaurantName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Restaurant Name
          </label>

          <input
            id="restaurantName"
            type="text"
            value={restaurantName}
            onChange={(event) =>
              handleFieldChange(
                "restaurantName",
                event.target.value,
                setRestaurantName,
              )
            }
            placeholder="Enter restaurant name"
            disabled={loading}
            className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
              errors.restaurantName
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            } disabled:cursor-not-allowed disabled:bg-gray-100`}
          />

          {errors.restaurantName && (
            <p className="mt-1 text-sm text-red-500">{errors.restaurantName}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) =>
              handleFieldChange("city", event.target.value, setCity)
            }
            placeholder="e.g. Hyderabad"
            disabled={loading}
            className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
              errors.city
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            } disabled:cursor-not-allowed disabled:bg-gray-100`}
          />

          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city}</p>
          )}
        </div>

        {/* Cuisine */}
        <div>
          <label
            htmlFor="cuisine"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Cuisine
          </label>

          <input
            id="cuisine"
            type="text"
            value={cuisine}
            onChange={(event) =>
              handleFieldChange("cuisine", event.target.value, setCuisine)
            }
            placeholder="e.g. Indian"
            disabled={loading}
            className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
              errors.cuisine
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            } disabled:cursor-not-allowed disabled:bg-gray-100`}
          />

          {errors.cuisine && (
            <p className="mt-1 text-sm text-red-500">{errors.cuisine}</p>
          )}
        </div>

        {/* Preview Image */}
        <div>
          <label
            htmlFor="previewImage"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Preview Image URL
          </label>

          <input
            id="previewImage"
            type="text"
            value={previewImage}
            onChange={(event) =>
              handleFieldChange(
                "previewImage",
                event.target.value,
                setPreviewImage,
              )
            }
            placeholder="https://example.com/image.jpg"
            disabled={loading}
            className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
              errors.previewImage
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            } disabled:cursor-not-allowed disabled:bg-gray-100`}
          />

          {errors.previewImage && (
            <p className="mt-1 text-sm text-red-500">{errors.previewImage}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              handleFieldChange(
                "description",
                event.target.value,
                setDescription,
              )
            }
            placeholder="Describe the restaurant..."
            rows="4"
            disabled={loading}
            className={`w-full resize-none rounded-lg border px-4 py-3 outline-none transition ${
              errors.description
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            } disabled:cursor-not-allowed disabled:bg-gray-100`}
          />

          <div className="mt-1 flex justify-between">
            {errors.description ? (
              <p className="text-sm text-red-500">{errors.description}</p>
            ) : (
              <span />
            )}

            <span className="text-xs text-gray-400">
              {description.length}/500
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition ${
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

            <span>
              {loading
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Restaurant"}
            </span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={`flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition ${
              loading
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-gray-50"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantForm;
