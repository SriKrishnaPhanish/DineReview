function AuthToggle({ value, onChange, error }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-medium text-gray-700">Account Type</p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange("reviewer")}
          className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
            value === "reviewer"
              ? "border-blue-600 bg-blue-600 text-white"
              : error
                ? "border-red-400 bg-white text-gray-700 hover:bg-gray-50"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Reviewer
        </button>

        <button
          type="button"
          onClick={() => onChange("owner")}
          className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
            value === "owner"
              ? "border-blue-600 bg-blue-600 text-white"
              : error
                ? "border-red-400 bg-white text-gray-700 hover:bg-gray-50"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Owner
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default AuthToggle;
