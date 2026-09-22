import { Link } from "react-router-dom";
import { routes } from "../constants/routes";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

type NavbarProps = {
  isLoggedIn?: boolean;
  variant?: "guest" | "user";
  hideSearch?: boolean;
};

const Navbar = ({ isLoggedIn = false, variant = "guest", hideSearch = false }: NavbarProps) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  if (variant === "user") {
    return (
      <header className={`olx-navbar ${hideSearch ? "olx-navbar-no-search" : ""}`}>
        <div className="olx-brand">OLX</div>

        {!hideSearch && (
          <div className="olx-search-box" aria-label="Search listings">
            <span className="search-icon">⌕</span>
            <input type="text" placeholder='Search "Properties"' />
          </div>
        )}

        <div className="olx-actions">
          {isLoggedIn && (
            <Link to={routes.wishlist} className="action-item wishlist-link" aria-label="Wishlist">
              <button type="button" className="icon-button small-icon" aria-label="Wishlist">
                <span>♡</span>
              </button>
              <span>Wishlist</span>
            </Link>
          )}

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>

          <Link to={routes.sellProduct} className="sell-button">
            + SELL
          </Link>
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
