import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../store/useAuthStore";
import fondoLogin from "../assets/fondo-login.jpeg";
import logoBlanco from "../assets/logo-blanco.png";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!credentials.email || !credentials.password) {
      toast.error("Por favor, completa todos los campos");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      toast.error("Por favor, ingresa un email válido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await login(credentials);
      if (success) {
        toast.success("¡Bienvenido!");
        navigate("/viajes");
      } else {
        toast.error("Credenciales inválidas");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${fondoLogin})` }}
    >
      {/* Overlay azulado */}
      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]"></div>

      {/* Contenido */}
      <div className="mx-4 w-[480px] relative z-10">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Contenedor del logo con fondo azul */}
          <div className="w-full bg-[#0065f2] p-4">
            <img
              src={logoBlanco}
              alt="Logo"
              className="h-12 w-auto mx-auto object-contain"
            />
          </div>

          <div className="p-8 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-500">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoFocus
                    disabled={isLoading}
                    className="outline-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="ejemplo@email.com"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    className="outline-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white cursor-pointer bg-[var(--blue)] hover:bg-[var(--blue-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>

            <div className="text-center space-y-4">
              <button
                onClick={() => handleNavigation("/auth")}
                disabled={isLoading}
                className="cursor-pointer text-[var(--blue)] hover:text-[var(--blue-hover)] text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Regresar
              </button>
              <p className="text-sm text-gray-500">
                ¿Necesitas ayuda? Contacta al administrador del sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
