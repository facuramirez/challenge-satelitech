import { create } from 'zustand';
import { axiosInstance } from '../services/authService';

const useUserStore = create((set, get) => ({
  // Estado
  allUsers: [],
  users: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  sortConfig: {
    key: null,
    direction: 'asc'
  },

  // Ordenar usuarios
  sortUsers: (key) => {
    set((state) => {
      const direction = state.sortConfig.key === key && state.sortConfig.direction === 'asc' ? 'desc' : 'asc';
      
      const sortedUsers = [...state.allUsers].sort((a, b) => {
        if (key === 'createdAt' || key === 'updatedAt') {
          return direction === 'asc' 
            ? new Date(a[key]) - new Date(b[key])
            : new Date(b[key]) - new Date(a[key]);
        }
        
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      const start = (state.currentPage - 1) * state.pageSize;
      const end = start + state.pageSize;

      return {
        allUsers: sortedUsers,
        users: sortedUsers.slice(start, end),
        sortConfig: { key, direction }
      };
    });
  },

  // Obtener todos los usuarios
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/users');
      const allUsers = response.data;

      set((state) => {
        const total = allUsers.length;
        const totalPages = Math.ceil(total / state.pageSize);
        const start = (state.currentPage - 1) * state.pageSize;
        const end = start + state.pageSize;
        
        return {
          allUsers,
          users: allUsers.slice(start, end),
          total,
          totalPages,
          error: null
        };
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los usuarios';
      set({ 
        error: errorMessage,
        allUsers: [],
        users: [],
        total: 0,
        totalPages: 0
      });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  // Crear nuevo usuario
  createUser: async (userData) => {    
    try {
      const response = await axiosInstance.post('/users', userData);
      
      // Actualizar el estado con el nuevo usuario
      set((state) => {
        const newAllUsers = [response.data, ...state.allUsers];
        const total = newAllUsers.length;
        const totalPages = Math.ceil(total / state.pageSize);
        const start = (state.currentPage - 1) * state.pageSize;
        const end = start + state.pageSize;

        // Mantener el ordenamiento actual si existe
        const sortedUsers = state.sortConfig.key 
          ? [...newAllUsers].sort((a, b) => {
              if (state.sortConfig.key === 'createdAt' || state.sortConfig.key === 'updatedAt') {
                return state.sortConfig.direction === 'asc'
                  ? new Date(a[state.sortConfig.key]) - new Date(b[state.sortConfig.key])
                  : new Date(b[state.sortConfig.key]) - new Date(a[state.sortConfig.key]);
              }
              
              if (a[state.sortConfig.key] < b[state.sortConfig.key]) return state.sortConfig.direction === 'asc' ? -1 : 1;
              if (a[state.sortConfig.key] > b[state.sortConfig.key]) return state.sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
            })
          : newAllUsers;

        return {
          allUsers: sortedUsers,
          users: sortedUsers.slice(start, end),
          total,
          totalPages
        };
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear el usuario';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Actualizar usuario
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      
      // Actualizar el estado con el usuario modificado
      set((state) => {
        const updatedAllUsers = state.allUsers.map(user => 
          user._id === userId ? { ...user, ...response.data } : user
        );
        
        const total = updatedAllUsers.length;
        const totalPages = Math.ceil(total / state.pageSize);
        const start = (state.currentPage - 1) * state.pageSize;
        const end = start + state.pageSize;

        // Mantener el ordenamiento actual si existe
        const sortedUsers = state.sortConfig.key 
          ? [...updatedAllUsers].sort((a, b) => {
              if (state.sortConfig.key === 'createdAt' || state.sortConfig.key === 'updatedAt') {
                return state.sortConfig.direction === 'asc'
                  ? new Date(a[state.sortConfig.key]) - new Date(b[state.sortConfig.key])
                  : new Date(b[state.sortConfig.key]) - new Date(a[state.sortConfig.key]);
              }
              
              if (a[state.sortConfig.key] < b[state.sortConfig.key]) return state.sortConfig.direction === 'asc' ? -1 : 1;
              if (a[state.sortConfig.key] > b[state.sortConfig.key]) return state.sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
            })
          : updatedAllUsers;

        return {
          allUsers: sortedUsers,
          users: sortedUsers.slice(start, end),
          total,
          totalPages
        };
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el usuario';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Eliminar usuario
  deleteUser: async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      
      // Actualizar el estado eliminando el usuario
      set((state) => {
        const updatedAllUsers = state.allUsers.filter(user => user._id !== userId);
        const total = updatedAllUsers.length;
        const totalPages = Math.ceil(total / state.pageSize);
        const start = (state.currentPage - 1) * state.pageSize;
        const end = start + state.pageSize;

        // Mantener el ordenamiento actual si existe
        const sortedUsers = state.sortConfig.key 
          ? [...updatedAllUsers].sort((a, b) => {
              if (state.sortConfig.key === 'createdAt' || state.sortConfig.key === 'updatedAt') {
                return state.sortConfig.direction === 'asc'
                  ? new Date(a[state.sortConfig.key]) - new Date(b[state.sortConfig.key])
                  : new Date(b[state.sortConfig.key]) - new Date(a[state.sortConfig.key]);
              }
              
              if (a[state.sortConfig.key] < b[state.sortConfig.key]) return state.sortConfig.direction === 'asc' ? -1 : 1;
              if (a[state.sortConfig.key] > b[state.sortConfig.key]) return state.sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
            })
          : updatedAllUsers;

        return {
          allUsers: sortedUsers,
          users: sortedUsers.slice(start, end),
          total,
          totalPages,
          currentPage: state.currentPage > totalPages ? totalPages : state.currentPage
        };
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar el usuario';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Cambiar página
  setPage: (page) => {
    set((state) => {
      const start = (page - 1) * state.pageSize;
      const end = start + state.pageSize;
      return {
        currentPage: page,
        users: state.allUsers.slice(start, end)
      };
    });
  },

  // Cambiar tamaño de página
  setPageSize: (size) => {
    set((state) => {
      const start = 0;
      const end = size;
      const totalPages = Math.ceil(state.allUsers.length / size);
      return {
        pageSize: size,
        currentPage: 1,
        totalPages,
        users: state.allUsers.slice(start, end)
      };
    });
  },

  setLoading: (loading) => set({ loading }),
  
  // Limpiar errores
  clearError: () => set({ error: null })
}));

export default useUserStore; 