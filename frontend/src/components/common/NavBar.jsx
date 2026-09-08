import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/restaurants")}
            className="cursor-pointer text-2xl font-bold text-blue-600"
          >
            DineReview
          </button>

          {/* Restaurants */}
          <button
            type="button"
            onClick={() => navigate("/restaurants")}
            className="cursor-pointer text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Restaurants
          </button>

          {/* Owner-only navigation */}
          {user?.role === "owner" && (
            <button
              type="button"
              onClick={() => navigate("/my-restaurants")}
              className="cursor-pointer text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              My Restaurants
            </button>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {user && (
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                Welcome, {user.first_name}
              </p>

              <p className="text-xs capitalize text-gray-500">{user.role}</p>
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
