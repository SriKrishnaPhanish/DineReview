import AuthInput from "./AuthInput";
import AuthToggle from "./AuthToggle";

function AuthCard({
  mode,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  role,
  errors,
  loading,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onRoleChange,
  onSubmit,
  onNavigate,
}) {
  const isRegister = mode === "register";

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {isRegister ? "Create your account" : "Welcome Back"}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {isRegister ? "Join our restaurant community" : "Sign in to continue"}
        </p>
      </div>

      {isRegister && (
        <>
          <AuthInput
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={onFirstNameChange}
            placeholder="Enter first name"
            error={errors?.firstName}
          />

          <AuthInput
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={onLastNameChange}
            placeholder="Enter last name"
            error={errors?.lastName}
          />
        </>
      )}

      <AuthInput
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Enter email"
        error={errors?.email}
      />

      <AuthInput
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Enter password"
        error={errors?.password}
      />

      {isRegister && (
        <AuthInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          placeholder="Confirm password"
          error={errors?.confirmPassword}
        />
      )}

      {isRegister && (
        <AuthToggle value={role} onChange={onRoleChange} error={errors?.role} />
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3
                   font-semibold text-white transition
                   focus:outline-none focus:ring-2 focus:ring-blue-300
                   ${
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
            ? isRegister
              ? "Creating Account..."
              : "Logging in..."
            : isRegister
              ? "Create Account"
              : "Login"}
        </span>
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        {isRegister ? "Already have an account?" : "Don't have an account?"}

        <button
          type="button"
          onClick={onNavigate}
          disabled={loading}
          className={`ml-1 font-semibold text-blue-600 hover:text-blue-700 ${
            loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default AuthCard;
