import { useState } from "react";

export const NewTripModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    truck: "",
    driver: "",
    origin: "",
    destination: "",
    fuel: "",
    liters: "",
    departureDate: "",
    status: "pendiente",
  });

  // Datos de ejemplo para los selects
  const trucks = ["Camión 1", "Camión 2", "Camión 3", "Camión 4"];
  const cities = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "San Juan"];
  const fuelTypes = ["Diesel", "Gasolina", "GNC"];
  const litersOptions = ["50", "100", "150", "200", "250", "300"];
  const statusOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "en_curso", label: "En Curso" },
    { value: "completado", label: "Completado" },
    { value: "cancelado", label: "Cancelado" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos
    console.log(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-100">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <h3 className="text-xl font-semibold text-gray-900">Nuevo Viaje</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Camión
              </label>
              <select
                name="truck"
                value={formData.truck}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
              >
                <option value="">Seleccionar camión</option>
                {trucks.map((truck) => (
                  <option key={truck} value={truck}>
                    {truck}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conductor
              </label>
              <input
                type="text"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
                placeholder="Nombre del conductor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origen
              </label>
              <select
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
              >
                <option value="">Seleccionar origen</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
              >
                <option value="">Seleccionar destino</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Combustible
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
              >
                <option value="">Seleccionar combustible</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Litros
              </label>
              <select
                name="liters"
                value={formData.liters}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
              >
                <option value="">Seleccionar litros</option>
                {litersOptions.map((liters) => (
                  <option key={liters} value={liters}>
                    {liters} L
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Salida
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[var(--blue)] text-white rounded-lg hover:bg-[var(--blue-hover)] transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
