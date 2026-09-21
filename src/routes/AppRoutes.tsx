import { Route, Routes, BrowserRouter } from "react-router-dom";
import { routes } from "../constants/routes";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import NotFound from "../pages/NotFound";
import UserHome from "../pages/userHome";
import ProductListingPage from "../pages/ProductListing";

const AppRoutes = () => {
  return (
    <BrowserRouter>
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
        <Route path={routes.dashboard} element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
