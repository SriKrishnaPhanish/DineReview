function AuthInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border px-4 py-2.5
                   outline-none transition
                   ${
                     error
                       ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                       : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                   }`}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default AuthInput;
