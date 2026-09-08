import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import api from "../services/api";

function Login() {
  useEffect(() => {
    document.title = "Login | DineReview";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleLogin = async () => {
    setError("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        email: email.trim(),
        password,
      });

      console.log("Login successful:", response.data);

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/restaurants");
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        setError(error.response.data.detail || "Login failed");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    if (!loading) {
      navigate("/register");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <AuthCard
          mode="login"
          firstName=""
          lastName=""
          email={email}
          password={password}
          confirmPassword=""
          role="reviewer"
          errors={errors}
          loading={loading}
          onFirstNameChange={() => {}}
          onLastNameChange={() => {}}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={() => {}}
          onRoleChange={() => {}}
          onSubmit={handleLogin}
          onNavigate={handleNavigate}
        />

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
