import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { useAuth } from '../hooks/useAuth';
import { Trips } from '../components/Trips';
import { Users } from '../components/Users';
import { Statistics } from '../components/Statistics';
export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <Routes>
      <Route path="/viajes" element={<Dashboard><Trips /></Dashboard>} />
      <Route path="/usuarios" element={<Dashboard><Users /></Dashboard>} />
      <Route path="/estadisticas" element={<Dashboard><Statistics /></Dashboard>} />
      <Route path="*" element={<Navigate to="/viajes" />} />
    </Routes>
  );
}; 