import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";

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
  return (
    <div className="user-home-page">
      <Navbar isLoggedIn variant="user" />

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
              <strong>08</strong>
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
        </section>

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