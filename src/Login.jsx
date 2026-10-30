
import { useState } from "react";
import "./Login.css";
import EmployeePortal from "./EmployeePortal";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!username.trim() || !password) {
      setMessage("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(
        "http://localhost:3232/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const result = await response.text();

      if (response.ok && result.trim() === "Login Successful") {
        setLoggedIn(true);
        setMessage("");
      } else {
        setMessage("Invalid username or password.");
      }
    } catch (error) {
      setMessage("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return (
      <EmployeePortal
        onLogout={() => {
          setLoggedIn(false);
          setUsername("");
          setPassword("");
          setMessage("");
        }}
      />
    );
  }

  return (
    <div className="login-page">
      <div className="login-brand-panel">
        <div className="brand-icon">
          <span>EP</span>
        </div>

        <p className="brand-tag">SMART WORKSPACE</p>
        <h1>Employee Portal</h1>

        <p className="brand-description">
          A simple and smart way to manage your employees,
          all in one place.
        </p>

        <div className="brand-feature">
          <span>✓</span>
          Employee management
        </div>

        <div className="brand-feature">
          <span>✓</span>
          Quick search and updates
        </div>

        <div className="brand-feature">
          <span>✓</span>
          Centralized dashboard
        </div>
      </div>

      <div className="login-form-panel">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-mobile-icon">EP</div>

          <p className="login-eyebrow">YOUR WORKSPACE</p>
          <h2>Welcome back!</h2>

          <p className="login-subtitle">
            Enter your details to access your dashboard.
          </p>

          <label htmlFor="username">Username</label>

          <div className="login-input-wrap">
            <span>♙</span>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="login-input-wrap">
            <span>♙</span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />

            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {message && (
            <p className="login-message" role="alert">
              {message}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p className="login-footer">
            Secure access to your employee dashboard
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
