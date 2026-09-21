import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthCreate";
import getProducts from "../services/productService";
import type { Product } from "../types/productType";

const filterOptions = [
  "All",
  "Cars",
  "Homes",
  "Electronics",
  "Furniture",
  "Mobiles",
  "Jobs",
  "Services",
];

const ProductListingPage = () => {
  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.isAuthenticated);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();

      if (active) {
        setProducts(data);
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const searchableText = [
        product.title,
        product.category,
        product.location,
        product.description,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="product-search-page">
      <Navbar isLoggedIn={isLoggedIn} variant={isLoggedIn ? "user" : "guest"} />

      <main className="product-search-shell">
        <section className="product-search-header">
          <div>
            <p className="eyebrow">Marketplace</p>
            <h1>Find the right product nearby.</h1>
          </div>

          <div className="search-bar-wrapper">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title, category, location..."
              aria-label="Search products"
            />
          </div>
        </section>

        <section className="product-category-filters" aria-label="Product categories">
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`filter-chip ${selectedCategory === option ? "active" : ""}`}
              onClick={() => setSelectedCategory(option)}
            >
              {option}
            </button>
          ))}
        </section>

        {loading ? (
          <div className="product-search-loading">
            <Loader />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No matches found</h3>
            <p>Try a different keyword or switch to another category.</p>
          </div>
        ) : (
          <ProductList
            title={
              selectedCategory === "All"
                ? "Search results"
                : `${selectedCategory} listings`
            }
            products={filteredProducts.map((product) => ({
              ...product,
              badge: "Popular",
            }))}
          />
        )}
      </main>
    </div>
  );
};

export default ProductListingPage;
