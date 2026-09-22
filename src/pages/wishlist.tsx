import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import { auth } from "../services/firebase";
import getProducts from "../services/productService";
import { getWishlist } from "../services/wishlistService";
import type { Product } from "../types/productType";
import { useNavigate } from "react-router";

const Wishlist = () => {
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const loadWishlist = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setSavedProducts([]);
        return;
      }

      const [savedIds, allProducts] = await Promise.all([
        getWishlist(userId),
        getProducts(),
      ]);

      const filtered = allProducts.filter((product) => savedIds.includes(product.id));
      setSavedProducts(filtered);
    };

    loadWishlist();
  }, []);

  return (
    <div className="user-home-page">
      <Navbar isLoggedIn variant="user" hideSearch />

      <main className="user-home-content">
        {savedProducts.length > 0 ? (
          <ProductList
            title="My wishlist"
            products={savedProducts.map((product) => ({
              ...product,
              badge: "Saved",
            }))}
          />
        ) : (
          <div className="empty-state wishlist-empty-state">
            <h3>Your wishlist is empty</h3>
            <p>Save products you like to see them here.</p>
            <button
              type="button"
              className="primary-button wishlist-empty-button"
              onClick={() => navigate("/products")}
            >
              Back to Product Listing
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;