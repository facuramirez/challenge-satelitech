import { Navigate, Route, Routes } from 'react-router-dom';
import { Auth } from '../pages/Auth';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { useAuth } from '../hooks/useAuth';

export const AuthRoutes = () => {
 

  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}; 