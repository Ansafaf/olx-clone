import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../constants/routes";
import { useAuth } from "../context/AuthCreate";

const Register = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setError("Authentication is unavailable right now.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await auth.register(email, password);
      navigate(routes.dashboard);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong while creating your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-visual">
          <span className="badge">Join the community</span>
          <h1>Start selling today.</h1>
          <p>
            Create a free account to list products, message buyers, and grow your local business with confidence.
          </p>
          <ul>
            <li>Quick listings in a few taps</li>
            <li>Direct chat with buyers</li>
            <li>No hidden fees, easy setup</li>
          </ul>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <span className="brand-mark">OLX</span>
            <h2>Create account</h2>
            <p>Set up your new marketplace profile.</p>
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
                placeholder="Choose a password"
                minLength={6}
                required
              />
            </label>

            {error ? <div className="error-box">{error}</div> : null}

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to={routes.login}>Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;