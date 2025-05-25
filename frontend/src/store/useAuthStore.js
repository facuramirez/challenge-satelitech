import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { checkAndRefreshToken } from '../services/authService';

const useAuthStore = create((set, get) => ({
  // Estado
  isAuthenticated: false,
  user: null,
  loading: true,

  // Acciones
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/auth/login`,
        credentials,
        { withCredentials: true }
      );
      
      const { token } = response.data.user;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      
      set({
        user: decoded,
        isAuthenticated: true
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    } catch (error) {
      return false;
    }
  },

  setAuth: (user) => {
    const { token } = user;
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    set({
      user: decoded,
      isAuthenticated: true
    });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return true;
  },
  
  logout: () => {
    axios.post(`http://localhost:4000/api/auth/logout`, {}, { withCredentials: true });
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    set({
      user: null,
      isAuthenticated: false
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp * 1000;
        const currentTime = Date.now();
        
        // Si el token está próximo a expirar (menos de 1 minuto) o ya expiró
        if (tokenExpiration - currentTime < 60000 || tokenExpiration <= currentTime) {
          // Intentar renovar el token
          const refreshSuccess = await checkAndRefreshToken();
          if (refreshSuccess) {
            const newToken = localStorage.getItem("token");
            const newDecoded = jwtDecode(newToken);
            set({
              user: newDecoded,
              isAuthenticated: true
            });
            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          } else {
            get().logout();
          }
        } else {
          // El token aún es válido
          set({
            user: decoded,
            isAuthenticated: true
          });
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        get().logout();
      }
    }
    set({ loading: false });
  }
}));

export default useAuthStore; 