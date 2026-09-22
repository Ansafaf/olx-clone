
import { useEffect, useState } from "react";
import { routes } from "../constants/routes";
import { useAuth } from "../context/AuthCreate";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import getProducts from "../services/productService";
import type { Product } from "../types/productType";

const categories = [
  { name: "Cars", icon: "🚗", detail: "Popular models" },
  { name: "Homes", icon: "🏠", detail: "Explore listings" },
  { name: "Electronics", icon: "💻", detail: "Latest gadgets" },
  { name: "Furniture", icon: "🛋️", detail: "Fresh finds" }
];

const featured = [
  { title: "Used BMW X5", price: "₹18,500", location: "Delhi" },
  { title: "3-bedroom Apartment", price: "₹1,200/mo", location: "Bengaluru" },
  { title: "Gaming Laptop", price: "₹900", location: "Mumbai" },
  { title: "Office Desk Setup", price: "₹12,999", location: "Hyderabad" },
];

const whyChooseUs = [
  "Verified local sellers",
  "Quick, secure transactions",
  "Free listings for beginners",
  "Real-time buyer messaging",
];

const Home = () => {
  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.isAuthenticated);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="landing-page">
      <Navbar isLoggedIn={isLoggedIn} variant="guest" />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="badge">Buy and sell locally</span>
            <h1>Find great deals nearby.</h1>
            <p>
              Shop trusted local listings, connect with sellers in your area, and discover treasures in your neighborhood.
            </p>

            <div className="stats-row">
              <div>
                <strong>120k+</strong>
                <span>Listings</span>
              </div>
              <div>
                <strong>25k</strong>
                <span>Sellers</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Ratings</span>
              </div>
            </div>
          </div>

          <div className="hero-spotlight">
            <div className="spotlight-card main-card">
              <div className="listing-badge">Featured</div>
              <h3>Premium City Apartment</h3>
              <p>2 bed • 1 bath • Great view</p>
              <div className="listing-price">₹950/mo</div>
            </div>
            <div className="spotlight-card mini-card">
              <span>📍</span>
              <div>
                <strong>Nearby</strong>
                <p>98 listings today</p>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="categories">
          <div className="section-heading">
            <p className="eyebrow">Explore categories</p>
            <h2>Popular ways to shop</h2>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <article key={category.name} className="category-card">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.name}</h3>
                <p>{category.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="benefits-section">
          <div className="section-heading">
            <p className="eyebrow">Why choose us</p>
            <h2>Built for everyday buying and selling</h2>
          </div>

          <div className="benefits-grid">
            {whyChooseUs.map((item) => (
              <div key={item} className="benefit-item">
                <span>✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
       
        <ProductList
          title="Latest Products"
          viewAllLink={routes.products}
          showViewAll
          products={
            products.length > 0
              ? products.slice(0, 3).map((product) => ({
                  ...product,
                  badge: "Hot",
                }))
              : featured.slice(0, 3).map((item) => ({
                  id: item.title,
                  title: item.title,
                  price: Number(item.price.replace(/[^\d]/g, "")),
                  location: item.location,
                  description: "Verified local item with quick pickup and safe payment options.",
                  category: "Featured",
                  imageUrl: "",
                  sellerId: "demo",
                  badge: "Hot",
                }))
          }
        />
      </main>
    </div>
  );
};

export default Home;