import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import fondoLogin from '../assets/fondo-login.jpeg';
import logoBlanco from '../assets/logo-blanco.png';

export const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await login(credentials);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciales inválidas');
    }
  };

  const handleNavigation = (path) => {
    // if (!document.startViewTransition) {
    //   navigate(path);
    //   return;
    // }

    // document.startViewTransition(() => {
    //   navigate(path);
    // });
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
            <img src={logoBlanco} alt="Logo" className="h-12 w-auto mx-auto object-contain" />
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                    required
                    autoFocus
                    className="outline-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="ejemplo@email.com"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="outline-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white cursor-pointer bg-[var(--blue)] hover:bg-[var(--blue-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Iniciar sesión
              </button>
            </form>

            <div className="text-center space-y-4">
              <button
                onClick={() => handleNavigation('/auth')}
                className="cursor-pointer text-[var(--blue)] hover:text-[var(--blue-hover)] text-sm font-medium transition-colors"
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