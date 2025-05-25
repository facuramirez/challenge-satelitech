import {
  Navigate,
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { Trips } from "../components/Trips";
import { Users } from "../components/Users";
import { Statistics } from "../components/Statistics";
import { AuthRoutes } from "./AuthRoutes"; // Asegúrate de que este existeúrate de importar correctamente
import { AdminRoute } from "./AdminRoute";
import useAuthStore from "../store/useAuthStore";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Router>
        <Routes>
          {!isAuthenticated ? (
            // Rutas públicas (por ejemplo, login)
            <>
              <Route path="/*" element={<AuthRoutes />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              {/* Rutas privadas (requieren login) */}
              <Route
                path="/viajes"
                element={
                  <Dashboard>
                    <Trips />
                  </Dashboard>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <AdminRoute>
                    <Dashboard>
                      <Users />
                    </Dashboard>
                  </AdminRoute>
                }
              />
              <Route
                path="/estadisticas"
                element={
                  <Dashboard>
                    <Statistics />
                  </Dashboard>
                }
              />
              <Route path="*" element={<Navigate to="/viajes" />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
};
