import { Route, Routes, BrowserRouter } from "react-router-dom";
import { routes } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import { lazy, Suspense } from "react";
import Loader from "../components/Loader";


const Login = lazy(()=> import("../pages/Login"));
const Home = lazy(()=> import("../pages/Home"));
const Register = lazy(()=> import("../pages/Register"));
const NotFound = lazy(()=> import('../pages/NotFound'));
const UserHome = lazy(()=> import("../pages/userHome"));
const ProductListingPage = lazy(()=> import("../pages/ProductListing"));
const ProductDetails = lazy(()=> import("../pages/productDetails"));
const SellProduct = lazy(()=> import("../pages/SellProduct"));
const Wishlist = lazy(()=> import('../pages/wishlist'));

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path={routes.Home} element={<Home />} />
        <Route
          path={routes.login}
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path={routes.register}
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path={routes.products}
          element={<ProductListingPage />}
        />
        <Route
          path={routes.productDetails}
          element={<ProductDetails />}
        />
        <Route
          path={routes.sellProduct}
          element={
            <ProtectedRoute>
              <SellProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.wishlist}
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route path={routes.dashboard} element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
