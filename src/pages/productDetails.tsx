
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getProductById, updateProduct } from "../services/productService";
import type { Product } from "../types/productType";
import { routes } from "../constants/routes";
import { auth } from "../services/firebase";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    location: "",
    imageUrl: "",
  });

  const currentUser = auth.currentUser;
  const isOwner = product?.sellerId === currentUser?.uid;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) {
      setFormData({
        title: "",
        price: "",
        category: "",
        description: "",
        location: "",
        imageUrl: "",
      });
      setIsAddedToCart(false);
      setIsEditing(false);
      return;
    }

    setFormData({
      title: product.title,
      price: String(product.price),
      category: product.category,
      description: product.description,
      location: product.location,
      imageUrl: product.imageUrl,
    });

    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const alreadyAdded = storedCart.some(
        (item: { id?: string }) => item.id === product.id
      );
      setIsAddedToCart(alreadyAdded);
    } catch (error) {
      console.error("Failed to read cart from localStorage:", error);
      setIsAddedToCart(false);
    }
  }, [product]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleAddCart = () => {
    if (!product) return;

    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = storedCart.some((item: { id?: string }) => item.id === product.id);

      const nextCart = exists
        ? storedCart
        : [
            ...storedCart,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              imageUrl: product.imageUrl,
              quantity: 1,
            },
          ];

      localStorage.setItem("cart", JSON.stringify(nextCart));
      setIsAddedToCart(true);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const handleSaveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!product || !id) return;

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      return;
    }

    const updates = {
      title: formData.title.trim(),
      price: Number(formData.price),
      category: formData.category,
      description: formData.description.trim(),
      location: formData.location.trim(),
      imageUrl: formData.imageUrl.trim(),
    };

    await updateProduct(id, updates);
    setProduct({ ...product, ...updates });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Navbar variant="guest" />
        <div className="product-details-loading">
          <Loader />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Navbar variant="guest" />
        <main className="product-details-shell">
          <div className="empty-state">
            <h3>Product details not found</h3>
            <p>The product you are looking for is no longer available.</p>
            <Link to={routes.products} className="primary-button">
              Browse listings
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const imageUrl =
    product.imageUrl && product.imageUrl.trim()
      ? product.imageUrl
      : "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="product-details-page">
      <Navbar variant="guest" />

      <main className="product-details-shell">
        <div className="product-details-breadcrumbs">
          <Link to={routes.Home}>Home</Link>
          <span>/</span>
          <Link to={routes.products}>Products</Link>
          <span>/</span>
          <span>{product.category}</span>
        </div>

        <section className="product-details-layout">
          <div className="product-gallery-card">
            <div className="product-gallery-main">
              <img src={imageUrl} alt={product.title} />
            </div>
            <div className="product-thumbnail-row">
              <div className="product-thumbnail active">
                <img src={imageUrl} alt={`${product.title} preview`} />
              </div>
              <div className="product-thumbnail">
                <img src={imageUrl} alt={`${product.title} alternate view`} />
              </div>
              <div className="product-thumbnail">
                <img src={imageUrl} alt={`${product.title} detail view`} />
              </div>
            </div>
          </div>

          <aside className="product-summary-card">
            <span className="listing-badge">{product.category}</span>
            <h1>{product.title}</h1>
            <div className="product-price-row">
              <strong>₹{product.price}</strong>
              <span>Negotiable</span>
            </div>

            <div className="product-summary-meta">
              <div>
                <span className="meta-label">Location</span>
                <strong>{product.location}</strong>
              </div>
              <div>
                <span className="meta-label">Seller</span>
                <strong>Verified seller</strong>
              </div>
            </div>

            {isOwner ? (
              <div className="product-actions">
                {isEditing ? (
                  <form className="edit-product-form" onSubmit={handleSaveEdit}>
                    <label>
                      Title
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Price (₹)
                      <input
                        type="number"
                        name="price"
                        min="1"
                        value={formData.price}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Category
                      <select name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="Cars">Cars</option>
                        <option value="Homes">Homes</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Mobiles">Mobiles</option>
                        <option value="Jobs">Jobs</option>
                        <option value="Services">Services</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label>
                      Location
                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Image URL
                      <input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                      />
                    </label>

                    <div className="product-actions-inline">
                      <button type="button" className="secondary-button" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="primary-button">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <button type="button" className="primary-button wide-button" onClick={() => setIsEditing(true)}>
                    Edit Product
                  </button>
                )}
              </div>
            ) : (
              <div className="product-actions">
                <button
                  type="button"
                  className={`primary-button wide-button ${isAddedToCart ? "added-button" : ""}`}
                  onClick={handleAddCart}
                  disabled={isAddedToCart}
                >
                  {isAddedToCart ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            )}
          </aside>
        </section>

        <section className="product-info-grid">
          <article className="details-description-card">
            <div className="section-label">Description</div>
            <h2>About this listing</h2>
            <p>{product.description}</p>

            <ul className="details-points">
              <li>Well-kept condition and ready for pickup</li>
              <li>Location-based deal with quick follow-up</li>
              <li>Transparent pricing and genuine seller details</li>
            </ul>
          </article>

          <aside className="details-facts-card">
            <div className="section-label">Highlights</div>
            <ul>
              <li>
                <span>Category</span>
                <strong>{product.category}</strong>
              </li>
              <li>
                <span>Price</span>
                <strong>₹{product.price}</strong>
              </li>
              <li>
                <span>Location</span>
                <strong>{product.location}</strong>
              </li>
              <li>
                <span>Listing ID</span>
                <strong>{product.id.slice(0, 8).toUpperCase()}</strong>
              </li>
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;