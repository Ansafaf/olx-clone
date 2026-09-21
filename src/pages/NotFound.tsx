import { Link } from "react-router-dom";
import { routes } from "../constants/routes";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-code">404</div>
        <span className="badge">Page not found</span>
        <h1>Looks like this listing is gone.</h1>
        <p>
          The page you’re looking for may have moved, been removed, or never existed.
        </p>

        <div className="not-found-actions">
          <Link to={routes.Home} className="primary-button">
            Back to home
          </Link>
          <Link to={routes.login} className="secondary-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;