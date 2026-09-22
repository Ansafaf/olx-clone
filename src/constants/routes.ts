export const routes = {
    Home: "/",
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    products: "/products",
    sellProduct: "/sell",
    productDetails: "/products/:id",
    wishlist: "/wishlist"
} as const;

export const getProductDetailRoute = (productId: string) => `/products/${productId}`;
