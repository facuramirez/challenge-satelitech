import { useState } from "react";
import { NewTripModal } from "./NewTripModal";

export const TripsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulación de datos para el ejemplo
  const data = Array(100)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      truck: `Camión ${index + 1}`,
      driver: `Conductor ${index + 1}`,
      category: `Categoría ${(index % 5) + 1}`,
      status: ["Pendiente", "En curso", "Completado", "Cancelado"][index % 4],
      fuel: ["Diesel", "Gasolina", "GNC"][index % 3],
      origin: `Ciudad ${(index % 10) + 1}`,
    }));

  // Cálculo de la paginación
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset a la primera página cuando cambia el tamaño
  };

  return (
    <div className="flex flex-col gap-4 p-6 shadow-sm bg-white rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-700">Viajes:</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] py-2 text-white px-4 rounded-lg md:w-fit cursor-pointer"
        >
          Nuevo viaje
        </button>
      </div>

      {/* Contenedor con scroll horizontal */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Ancho mínimo para asegurar scroll en móviles */}
          <table className="w-full table-auto border-collapse table table-md">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-4 font-semibold text-gray-600">#</th>
                <th className="p-4 font-semibold text-gray-600">Camión</th>
                <th className="p-4 font-semibold text-gray-600">Conductor</th>
                <th className="p-4 font-semibold text-gray-600">Categoría</th>
                <th className="p-4 font-semibold text-gray-600">Estado</th>
                <th className="p-4 font-semibold text-gray-600">Combustible</th>
                <th className="p-4 font-semibold text-gray-600">Origen</th>
                <th className="p-4 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="p-4">{row.id}</td>
                  <td className="p-4">{row.truck}</td>
                  <td className="p-4">{row.driver}</td>
                  <td className="p-4">{row.category}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        row.status === "Completado"
                          ? "bg-green-100 text-green-800"
                          : row.status === "En curso"
                          ? "bg-blue-100 text-blue-800"
                          : row.status === "Pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4">{row.fuel}</td>
                  <td className="p-4">{row.origin}</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mt-4 px-4">
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          {/* Botones de página */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`cursor-pointer px-3 py-1 border rounded-md ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>

      <NewTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
