import React, { useEffect, useState } from "react";
import useTripStore from "../store/useTripStore";
import TripTableSkeleton from "./TripTableSkeleton";
import TripModal from "./TripModal";
import ConfirmationModal from "./ConfirmationModal";
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
    deleteTrip,
    updateTrip,
  } = useTripStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleOpenModal = (trip = null) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTrip(null);
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (trip) => {
    setTripToDelete(trip);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setTripToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTrip(tripToDelete._id);
      toast.success("Viaje eliminado correctamente", {
        position: "bottom-center",
      });
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Error al eliminar el viaje", {
        position: "bottom-center",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <TripTableSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 shadow shadow-sm">
      <div className="flex flex-row justify-between items-center gap-2">
        <span className="text-lg font-bold text-gray-700">Viajes:</span>
        <button
          onClick={() => handleOpenModal()}
          className="px-3 py-1 text-base text-white bg-[var(--orange)] hover:bg-[var(--orange)] rounded-md transition-colors cursor-pointer"
          // className="text-white px-4 py-1 rounded-md bg-[var(--orange)] hover:bg-[var(--orange-hover)] transition-colors duration-200 cursor-pointer"
        >
          Nuevo viaje
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full w-max table table-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap min-w-fit">
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
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trips.map((trip, index) => {
              const status = (
                trip.status.charAt(0).toUpperCase() + trip.status.slice(1)
              ).replaceAll("_", " ");
              return (
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
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(trip)}
                        className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(trip)}
                        className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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

      {/* Modal de viaje (nuevo/editar) */}
      {isModalOpen && (
        <TripModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          trip={selectedTrip}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Viaje"
        message={`¿Está seguro que desea eliminar el viaje del camión ${
          tripToDelete?.truck || ""
        } con destino a ${tripToDelete?.destination || ""}?`}
        loading={isDeleting}
      />
    </div>
  );
};
