import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { addToWishlist, isInWishlist, removeFromWishlist } from "../services/wishlistService";
import type { Product } from "../types/productType";
import { getProductDetailRoute } from "../constants/routes";

export type ProductCardItem = Product & {
  badge?: string;
};

type ProductCardProps = {
  product: ProductCardItem;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userId = auth.currentUser?.uid;

  const fallbackImage =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  useEffect(() => {
    if (!userId || !product.id) {
      setIsSaved(false);
      return;
    }

    const loadSavedState = async () => {
      const saved = await isInWishlist(userId, product.id);
      setIsSaved(saved);
    };

    loadSavedState();
  }, [userId, product.id]);

  const imageSource = product.imageUrl && product.imageUrl.trim() ? product.imageUrl : fallbackImage;

  const cardStyle = {
    backgroundImage: `url(${imageSource})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const handleWishlistToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userId || !product.id) {
      return;
    }

    setIsLoading(true);

    if (isSaved) {
      await removeFromWishlist(userId, product.id);
      setIsSaved(false);
    } else {
      await addToWishlist(userId, product.id);
      setIsSaved(true);
    }

    setIsLoading(false);
  };

  return (
    <article className="product-card-item">
      <Link to={getProductDetailRoute(product.id)} className="product-card-link" aria-label={`View details for ${product.title}`}>
        <div className="product-card-image" style={cardStyle}>
          <div className="product-card-badge">{product.badge ?? "Featured"}</div>
          {!product.imageUrl && <span>{product.category ?? "Listing"}</span>}
        </div>
      </Link>

      <div className="product-card-body">
        <div className="product-card-header">
          <Link to={getProductDetailRoute(product.id)} className="product-title-link" aria-label={`View details for ${product.title}`}>
            <h3>{product.title}</h3>
          </Link>
          {userId && (
            <button
              type="button"
              className={`wishlist-button ${isSaved ? "is-active" : ""}`}
              aria-label={`Save ${product.title}`}
              aria-pressed={isSaved}
              disabled={isLoading || !userId}
              onClick={handleWishlistToggle}
            >
              {isSaved ? "♥" : "♡"}
            </button>
          )}
        </div>

        <p className="product-card-description">
          {product.description ?? "Fresh local deal with verified details and quick response."}
        </p>

        <div className="product-card-meta">
          <span className="product-price">₹{product.price}</span>
          <span className="product-location">{product.location}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
