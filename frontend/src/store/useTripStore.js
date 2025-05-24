import { create } from 'zustand';
import { axiosInstance } from '../services/authService';

const useTripStore = create((set, get) => ({
  allTrips: [], // Todos los viajes sin paginar
  trips: [], // Viajes paginados actuales
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

  // Ordenar viajes
  sortTrips: (key) => {
    set((state) => {
      const direction = state.sortConfig.key === key && state.sortConfig.direction === 'asc' ? 'desc' : 'asc';
      
      const sortedTrips = [...state.allTrips].sort((a, b) => {
        if (key === 'departureDate') {
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
        allTrips: sortedTrips,
        trips: sortedTrips.slice(start, end),
        sortConfig: { key, direction }
      };
    });
  },

  // Obtener todos los viajes
  fetchTrips: async (query={}) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/trips', { params: query });
      const allTrips = response.data.trips;

      set((state) => {
        const total = allTrips.length;
        const totalPages = Math.ceil(total / state.pageSize);
        const start = (state.currentPage - 1) * state.pageSize;
        const end = start + state.pageSize;
        
        return {
          allTrips,
          trips: allTrips.slice(start, end),
          total,
          totalPages,
          error: null
        };
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los viajes';
      set({ 
        error: errorMessage,
        allTrips: [],
        trips: [],
        total: 0,
        totalPages: 0
      });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  // Crear nuevo viaje
  createTrip: async (tripData) => {    
    try {
      const response = await axiosInstance.post('/trips', tripData);
      
      // Actualizar el estado con el nuevo viaje
      set((state) => {
        const newAllTrips = [response.data, ...state.allTrips];
        const total = newAllTrips.length;
        const totalPages = Math.ceil(total / state.pageSize);
        const start = (state.currentPage - 1) * state.pageSize;
        const end = start + state.pageSize;

        // Mantener el ordenamiento actual si existe
        const sortedTrips = state.sortConfig.key 
          ? [...newAllTrips].sort((a, b) => {
              if (state.sortConfig.key === 'departureDate') {
                return state.sortConfig.direction === 'asc'
                  ? new Date(a[state.sortConfig.key]) - new Date(b[state.sortConfig.key])
                  : new Date(b[state.sortConfig.key]) - new Date(a[state.sortConfig.key]);
              }
              
              if (a[state.sortConfig.key] < b[state.sortConfig.key]) return state.sortConfig.direction === 'asc' ? -1 : 1;
              if (a[state.sortConfig.key] > b[state.sortConfig.key]) return state.sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
            })
          : newAllTrips;

        return {
          allTrips: sortedTrips,
          trips: sortedTrips.slice(start, end),
          total,
          totalPages
        };
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear el viaje';
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
        trips: state.allTrips.slice(start, end)
      };
    });
  },

  // Cambiar tamaño de página
  setPageSize: (size) => {
    set((state) => {
      const start = 0;
      const end = size;
      const totalPages = Math.ceil(state.allTrips.length / size);
      return {
        pageSize: size,
        currentPage: 1,
        totalPages,
        trips: state.allTrips.slice(start, end)
      };
    });
  },

  setLoading: (loading) => set({ loading }),
  
  // Limpiar errores
  clearError: () => set({ error: null })
}));

export default useTripStore; 