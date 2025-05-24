import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

// Crear una instancia de axios con configuración común
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Variable para controlar si hay un refresh en progreso
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error no es 401 o la ruta es refresh, rechazar directamente
    if (error.response?.status !== 401 || originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    // Si ya intentamos refresh en esta petición y falló, rechazar
    if (originalRequest._retry) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      try {
        // Si ya hay un refresh en progreso, encolar esta petición
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    // Marcar que estamos intentando refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Intentar refrescar el token
      const response = await axiosInstance.post('/auth/refresh');
      const { token } = response.data;
      
      // Guardar el nuevo token
      localStorage.setItem('token', token);
      
      // Actualizar el token en la petición original y en el interceptor
      originalRequest.headers.Authorization = `Bearer ${token}`;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Procesar la cola de peticiones pendientes
      processQueue(null, token);
      
      // Reintentar la petición original con el nuevo token
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Si el refresh falla, limpiar todo y redirigir al login
      localStorage.removeItem('token');
      processQueue(refreshError, null);
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Asegurarnos de limpiar el token incluso si falla el logout
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

// Función para verificar y renovar el token
export const checkAndRefreshToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await axiosInstance.post('/auth/refresh');
    const { token: newToken } = response.data;
    localStorage.setItem('token', newToken);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

export default {
  axiosInstance,
  login,
  logout,
  checkAndRefreshToken
}; 