import { useState, type FormEvent } from "react";

import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

type SignupResponse = {
  err?: string;
  message?: string;
};

export default function SignupPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter an email and password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        },
      );

      const data: SignupResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.err || data.message || "Unable to create account.",
        );
      }

      setMessage("Account created successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account.",
      );
    }
  }

  function handleCancel() {
    navigate("/login");
  }

  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h2 className="signup-header">Create Account</h2>

        <form
          className="signup-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="signup-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="signup-input"
          />

          <button type="submit" className="signup-btn">
            Create Account
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>

          {error && <p className="error-message">{error}</p>}

          {message && <p className="success-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}