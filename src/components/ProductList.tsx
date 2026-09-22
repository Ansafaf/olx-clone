import { Link } from "react-router-dom";
import ProductCard, { type ProductCardItem } from "./ProductCard";
import { routes } from "../constants/routes";

type ProductListProps = {
  title: string;
  products: ProductCardItem[];
  view?: "grid" | "compact";
  viewAllLink?: string;
  showViewAll?: boolean;
};

const ProductList = ({
  title,
  products,
  view = "grid",
  viewAllLink = routes.products,
  showViewAll = false,
}: ProductListProps) => {
  return (
    <section className="product-list-section">
      <div className="product-list-header">
        <div>
          <p className="eyebrow">Latest</p>
          <h2>{title}</h2>
        </div>

        {showViewAll && (
          <Link to={viewAllLink} className="view-all-button">
            View all
          </Link>
        )}
      </div>

      <div className={`product-list-grid ${view === "compact" ? "compact" : ""}`}>
        {products.map((product) => (
          <ProductCard key={product.id ?? product.title} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
