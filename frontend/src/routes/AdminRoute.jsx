import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/viajes" />;
  }

  return children;
};
