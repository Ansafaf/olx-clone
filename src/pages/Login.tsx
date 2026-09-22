import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../constants/routes";
import { useAuth } from "../context/AuthCreate";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setError("Authentication is unavailable right now.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await auth.login(email, password);
      navigate(routes.dashboard);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong while logging in.");
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-visual">
          <span className="badge">Smart local marketplace</span>
          <h1>Sell faster. Buy smarter.</h1>
          <p>
            Discover deals, connect with sellers nearby, and trade with confidence in a marketplace built for everyday needs.
          </p>
          <ul>
            <li>Verified local sellers</li>
            <li>Quick deals and secure payments</li>
            <li>Easy listing in minutes</li>
          </ul>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <span className="brand-mark">OLX</span>
            <h2>Welcome back</h2>
            <p>Sign in to manage your listings and messages.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            {error ? <div className="error-box">{error}</div> : null}

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Log in"}
            </button>
          </form>

          <div className="auth-footer">
            <span>New here?</span>
            <Link to={routes.register}>Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
