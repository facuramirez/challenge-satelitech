import React, { useEffect, useState } from "react";
import useTripStore from "../store/useTripStore";
import TripTableSkeleton from "./TripTableSkeleton";
import TripModal from "./TripModal";
import { toast } from "react-toastify";

const SortArrow = ({ direction }) => {
  if (!direction) return null;

  return direction === "asc" ? (
    <svg
      className="w-4 h-4 ml-1 inline-block absolute top-0 right-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 ml-1 inline-block absolute top-0 right-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

const SortableHeader = ({ label, field, sortConfig, onSort }) => {
  return (
    <th
      className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="relative">
        {label}
        <SortArrow
          direction={sortConfig.key === field ? sortConfig.direction : null}
        />
      </div>
    </th>
  );
};

export const TripsTable = () => {
  const {
    trips,
    loading,
    error,
    fetchTrips,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    sortTrips,
    sortConfig,
  } = useTripStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        await fetchTrips();
      } catch (err) {
        toast.error(
          "Error al cargar los viajes. Por favor, intente nuevamente.",
          {
            position: "bottom-center",
            autoClose: 5000,
          }
        );
      }
    };

    loadTrips();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <TripTableSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 shadow shadow-sm">
      <div className="flex flex-row justify-between items-center gap-2">
        <span className="text-lg font-bold text-gray-700">Viajes:</span>
        <button
          onClick={handleOpenModal}
          className="text-white px-4 py-2 rounded-md bg-[var(--orange)] hover:bg-[var(--orange-hover)] transition-colors duration-200 cursor-pointer"
        >
          Nuevo viaje
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full w-max table table-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap min-w-[80px]">
                #
              </th>
              <SortableHeader
                label="Camión"
                field="truck"
                sortConfig={sortConfig}
                onSort={sortTrips}
              />
              <SortableHeader
                label="Conductor"
                field="driver"
                sortConfig={sortConfig}
                onSort={sortTrips}
              />
              <SortableHeader
                label="Origen"
                field="origin"
                sortConfig={sortConfig}
                onSort={sortTrips}
              />
              <SortableHeader
                label="Destino"
                field="destination"
                sortConfig={sortConfig}
                onSort={sortTrips}
              />
              <SortableHeader
                label="Combustible"
                field="fuel"
                sortConfig={sortConfig}
                onSort={sortTrips}
              />
              <SortableHeader
                label="Litros"
                field="liters"
                sortConfig={sortConfig}
                onSort={sortTrips}
              />
              <SortableHeader
                label="Fecha Salida"
                field="departureDate"
                sortConfig={sortConfig}
                onSort={sortTrips}
              />
              <SortableHeader
                label="Estado"
                field="status"
                sortConfig={sortConfig}
                onSort={sortTrips}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trips.map((trip, index) => (
              <tr key={trip._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.truck}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.driver}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.origin}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {trip.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.fuel}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trip.liters}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(trip.departureDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      {
                        sin_iniciar: "bg-yellow-100 text-yellow-800",
                        en_transito: "bg-blue-100 text-blue-800",
                        completado: "bg-green-100 text-green-800",
                        cancelado: "bg-red-100 text-red-800",
                      }[trip.status]
                    }`}
                  >
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrar</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">registros</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {"<"}
          </button>

          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages || 1}
          </span>

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {">"}
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {">>"}
          </button>
        </div>
      </div>

      {/* Modal de nuevo viaje */}
      {isModalOpen && (
        <TripModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};
