import { useNavigate } from 'react-router-dom';
import fondoLogin from '../assets/fondo-login.jpeg';
import logoBlanco from '../assets/logo-blanco.png';

export const Auth = () => {
  const navigate = useNavigate();

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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bienvenido a Satelitech
              </h2>
              <p className="text-gray-500 mb-8">
                Selecciona una opción para continuar
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/auth/login')}
                className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
                bg-[var(--blue)] hover:bg-[var(--blue-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Ingresar
              </button>

              <button
                onClick={() => navigate('/auth/register')}
                className="w-full cursor-pointer flex justify-center py-3 px-4 border border-2 rounded-lg shadow-sm text-sm font-medium
                text-[var(--blue)] border-[var(--blue)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Registrarse
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>¿Necesitas ayuda? Contacta al administrador del sistema</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 