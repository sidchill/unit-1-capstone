import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

type LoginResponse = {
  token?: string;
  err?: string;
  message?: string;
};

export default function LoginPage() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/login",
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

      const data: LoginResponse = await response.json();
        if (!response.ok) {
        throw new Error(data.err || data.message || "Login failed.");
        }

        if (!data.token) {
        throw new Error("Login succeeded, but no token was returned.");
        }

        localStorage.setItem("authToken", data.token);
        navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to log in.",
      );
    }
  }

  return (
    <main className="login-page">
      <section className="login-form-container">
        <h1 className="login-header">Spoonful</h1>

        <h2 className="welcome-message">Welcome Back!</h2>

        <p className="login-page-message">
          Log in to your account to continue
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button type="submit">Log In</button>

          {message && <p className="login-message">{message}</p>}
        </form>

        <Link to="/signup" className="create-account-button">
          Create Account
        </Link>
      </section>
    </main>
  );
}