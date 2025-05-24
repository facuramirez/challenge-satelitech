import { Navigate, Route, Routes } from "react-router-dom";
import { Auth } from "../pages/Auth";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/ingreso" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
