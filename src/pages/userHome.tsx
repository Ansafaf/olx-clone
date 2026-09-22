import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import { auth } from "../services/firebase";
import getProducts from "../services/productService";
import { getWishlist } from "../services/wishlistService";
import type { Product } from "../types/productType";

const quickFilters = [
  "Cars",
  "Homes",
  "Electronics",
  "Furniture",
  "Mobiles",
  "Jobs",
];

const recommended = [
  { title: "Royal Enfield Classic 350", price: "₹1,85,000", location: "Pune" },
  { title: "2 BHK Apartment", price: "₹32,000/mo", location: "Noida" },
  { title: "MacBook Air M2", price: "₹92,000", location: "Bengaluru" },
];

const UserHome = () => {
  const [showWishlist, setShowWishlist] = useState(false);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadSavedProducts = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setSavedProducts([]);
        return;
      }

      const [savedIds, allProducts] = await Promise.all([
        getWishlist(userId),
        getProducts(),
      ]);

      const filteredProducts = allProducts.filter((product) => savedIds.includes(product.id));
      setSavedProducts(filteredProducts);
    };

    loadSavedProducts();
  }, [auth.currentUser?.uid]);

  return (
    <div className="user-home-page">
      <Navbar isLoggedIn variant="user" hideSearch />

      <main className="user-home-content">
        <section className="user-hero">
          <div>
            <p className="eyebrow">Your marketplace</p>
            <h1>Discover deals that match your lifestyle.</h1>
          </div>

          <div className="user-summary-card">
            <div>
              <span>Active listings</span>
              <strong>24</strong>
            </div>
            <div>
              <span>Saved items</span>
              <strong>{savedProducts.length}</strong>
            </div>
            <div>
              <span>Messages</span>
              <strong>12</strong>
            </div>
          </div>
        </section>

        <section className="quick-filters">
          {quickFilters.map((filter) => (
            <button key={filter} className="filter-chip">
              {filter}
            </button>
          ))}
          <button
            type="button"
            className={`filter-chip ${showWishlist ? "active" : ""}`}
            onClick={() => setShowWishlist((prev) => !prev)}
          >
            {showWishlist ? "Hide wishlist" : "View wishlist"}
          </button>
        </section>

        {showWishlist && (
          savedProducts.length > 0 ? (
            <ProductList
              title="Your saved items"
              products={savedProducts.map((product) => ({
                ...product,
                badge: "Saved",
              }))}
            />
          ) : (
            <div className="empty-state wishlist-empty-state">
              <h3>No saved items yet</h3>
              <p>Tap the heart on any product to add it to your wishlist.</p>
            </div>
          )
        )}

        <ProductList
          title="Recommended for you"
          products={recommended.map((item) => ({
            id: item.title,
            title: item.title,
            price: Number(item.price.replace(/[^\d]/g, "")),
            location: item.location,
            description: "Recently listed in your area with top-rated seller activity.",
            category: "Recommended",
            imageUrl: "",
            sellerId: "demo",
            badge: "New",
          }))}
        />
      </main>
    </div>
  );
};

export default UserHome;