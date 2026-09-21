import { Link } from "react-router-dom";
import { routes } from "../constants/routes";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

type NavbarProps = {
  isLoggedIn?: boolean;
  variant?: "guest" | "user";
};

const Navbar = ({ isLoggedIn = false, variant = "guest" }: NavbarProps) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  if (variant === "user") {
    return (
      <header className="olx-navbar">
        <div className="olx-brand">OLX</div>

        <div className="olx-search-box" aria-label="Search listings">
          <span className="search-icon">⌕</span>
          <input type="text" placeholder='Search "Properties"' />
        </div>

        <div className="olx-actions">
          <button className="icon-button chat-button" aria-label="Messages">
            <span>💬</span>
          </button>

          <div className="action-item">
            <button className="icon-button small-icon" aria-label="Wishlist">
              <span>♡</span>
            </button>
            <span>Wishlist</span>
          </div>

          <div className="action-item">
            <button className="icon-button small-icon" aria-label="Login">
              <span>◔</span>
            </button>
            <span>{isLoggedIn ? "Profile" : "Login"}</span>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>

          <button className="sell-button">+ SELL</button>
        </div>
      </header>
    );
  }
  return (
    <header className="topbar">
      <div className="brand">OLX</div>

      <nav className="nav-links" aria-label="Main navigation">
        <a href="#categories">Browse</a>
        <a href="#featured">Featured</a>
        <a href="#sell">Sell</a>
      </nav>

      <div className="nav-actions">
        {!isLoggedIn ? (
          <>
            <Link to={routes.login} className="secondary-button">
              Login
            </Link>
            <Link to={routes.register} className="primary-button">
              Sign up
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="secondary-button">
            Logout 
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
