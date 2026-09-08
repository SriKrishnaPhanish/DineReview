import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import api from "../services/api";

function Register() {
  useEffect(() => {
    document.title = "Register | DineReview";
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("reviewer");

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();

    // First Name
    if (!trimmedFirstName) {
      newErrors.firstName = "First name is required";
    } else if (trimmedFirstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (trimmedFirstName.length > 50) {
      newErrors.firstName = "First name must not exceed 50 characters";
    }

    // Last Name
    if (!trimmedLastName) {
      newErrors.lastName = "Last name is required";
    } else if (trimmedLastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (trimmedLastName.length > 50) {
      newErrors.lastName = "Last name must not exceed 50 characters";
    }

    // Email
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role
    if (!["reviewer", "owner"].includes(role)) {
      newErrors.role = "Please select a valid role";
    }

    return newErrors;
  };

  const handleRegister = async () => {
    setError("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/users/register", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
        role,
      });

      console.log("Registration successful:", response.data);

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/restaurants");
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response) {
        setError(error.response.data.detail || "Registration failed");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    if (!loading) {
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        <AuthCard
          mode="register"
          firstName={firstName}
          lastName={lastName}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          role={role}
          errors={errors}
          loading={loading}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onRoleChange={setRole}
          onSubmit={handleRegister}
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

export default Register;
