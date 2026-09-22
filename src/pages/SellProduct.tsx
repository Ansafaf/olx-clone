import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { routes } from "../constants/routes";
import { useAuth } from "../context/AuthCreate";
import { auth } from "../services/firebase";
import { addProduct } from "../services/productService";

const productCategories = [
  "Cars",
  "Homes",
  "Electronics",
  "Furniture",
  "Mobiles",
  "Jobs",
  "Services",
  "Other",
];

const initialFormState = {
  title: "",
  price: "",
  category: "Cars",
  description: "",
  location: "",
  imageUrl: "",
};

const SellProduct = () => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!authContext?.isAuthenticated && !auth.currentUser) {
      navigate(routes.login);
      return;
    }

    if (!formData.title.trim() || !formData.location.trim()) {
      setErrorMessage("Please fill in the title, and location fields.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage("Please enter a valid price for your product.");
      return;
    }

    try {
      setErrorMessage("");
      setIsSubmitting(true);

      await addProduct({
        title: formData.title.trim(),
        price: Number(formData.price),
        category: formData.category,
        description: formData?.description.trim(),
        location: formData.location.trim(),
        imageUrl: formData.imageUrl.trim(),
        sellerId: auth.currentUser?.uid ?? "guest-user",
      });

      setFormData(initialFormState);
      navigate(routes.products);
    } catch (error) {
      console.error("Failed to add product:", error);
      setErrorMessage("Something went wrong while listing your product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-page">
      <Navbar isLoggedIn variant="user" />

      <main className="sell-layout">
        <section className="sell-hero">
          <p className="eyebrow">Post your ad</p>
          <h1>Sell in a few simple steps.</h1>
          <p>
            Share item details, set a fair price, and list your product for local buyers.
          </p>
        </section>

        <section className="sell-form-card">
          <div className="sell-card-header">
            <div>
              <p className="eyebrow secondary">Product details</p>
              <h2>What are you selling?</h2>
            </div>
            <Link to={routes.products} className="inline-link">
              Browse listings
            </Link>
          </div>

          <form className="sell-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Product title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. iPhone 13 Pro Max"
                />
              </label>

              <label>
                Price (₹)
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="25000"
                  min="1"
                />
              </label>

              <label>
                Category
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  {productCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Location
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Bengaluru, Mumbai, etc."
                />
              </label>
            </div>

            <label>
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write a clear description about the condition, age, features, and anything buyers should know."
                rows={5}
              />
            </label>

            <label>
              Image URL (optional)
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/product-image.jpg"
              />
            </label>

            {errorMessage && <div className="error-box">{errorMessage}</div>}

            <div className="submit-actions">
              <button type="button" className="secondary-button" onClick={() => setFormData(initialFormState)}>
                Clear
              </button>

              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish ad"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default SellProduct;
