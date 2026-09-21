import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { routes } from "../constants/routes";
import { useAuth } from "../context/AuthCreate";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  if (auth?.isLoading) {
    return <Loader />;
  }

  if (!auth?.isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;