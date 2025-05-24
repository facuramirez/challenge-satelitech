import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useTripStore from "../store/useTripStore";
import { formatDateToDatetimeLocal } from "../utils/formatDatePicker";

const TripModal = ({ isOpen, onClose, trip }) => {
  const createTrip = useTripStore((state) => state.createTrip);
  const updateTrip = useTripStore((state) => state.updateTrip);
  const [formData, setFormData] = useState({
    truck: "",
    driver: "",
    origin: "",
    destination: "",
    fuel: "",
    liters: 0,
    departureDate: formatDateToDatetimeLocal(new Date()),
    status: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trip) {
      setFormData({
        ...trip,
        departureDate: formatDateToDatetimeLocal(new Date(trip.departureDate)),
      });
    } else if (!isOpen) {
      setFormData({
        truck: "",
        driver: "",
        origin: "",
        destination: "",
        fuel: "",
        liters: "",
        departureDate: formatDateToDatetimeLocal(new Date()),
        status: "",
      });
    }
  }, [isOpen, trip]);

  const handleErrors = () => {
    // Validar litros
    const liters = Number(formData.liters);
    const negativeLiters = liters > 0 && liters <= 30000;

    if (!negativeLiters) {
      toast.error("Litros deben ser mayores a 0 y menores o iguales a 30000", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return true;
    }

    // Validar fecha
    const departureDate = new Date(formData.departureDate);
    const currentDate = new Date();
    if (!trip && departureDate < currentDate) {
      toast.error(
        "La fecha de salida no puede ser anterior a la fecha actual",
        {
          position: "bottom-center",
          autoClose: 3000,
        }
      );
      return true;
    }

    // Validar campos vacíos
    const emptyFields = Object.entries(formData).some(
      ([, value]) => value === ""
    );

    if (emptyFields) {
      toast.error("Todos los campos son requeridos", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleErrors()) {
      return;
    }

    try {
      setLoading(true);
      let result;

      if (trip) {
        delete formData.driver;
        delete formData.departureDate;
        result = await updateTrip(trip._id, formData);
      } else {
        result = await createTrip(formData);
      }

      if (result.success) {
        toast.success(
          trip ? "Viaje actualizado exitosamente" : "Viaje creado exitosamente",
          {
            position: "bottom-center",
            autoClose: 3000,
          }
        );
        setFormData({
          truck: "",
          driver: "",
          origin: "",
          destination: "",
          fuel: "",
          liters: "",
          departureDate: formatDateToDatetimeLocal(new Date()),
          status: "",
        });

        onClose();
      } else {
        toast.error(
          result.error ||
            (trip ? "Error al actualizar el viaje" : "Error al crear el viaje"),
          {
            position: "bottom-center",
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      toast.error(
        trip ? "Error al actualizar el viaje" : "Error al crear el viaje",
        {
          position: "bottom-center",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
    setFormData({
      truck: "",
      driver: "",
      origin: "",
      destination: "",
      fuel: "",
      liters: "",
      departureDate: formatDateToDatetimeLocal(new Date()),
      status: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className={`relative bg-white w-full max-w-md transform transition-all duration-300 rounded-2xl shadow-2xl`}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {trip ? "Editar Viaje" : "Nuevo Viaje"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <select
                  name="truck"
                  value={formData.truck}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[var(--blue)] focus:outline-none transition-all appearance-none bg-white"
                  disabled={loading}
                >
                  <option value="">-</option>
                  <option value="ABC123">ABC123</option>
                  <option value="JYU246">JYU246</option>
                  <option value="KUN946">KUN946</option>
                </select>
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  Camión
                </label>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  name="driver"
                  value={formData.driver}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl disabled:bg-gray-100 disabled:pointer-events-none focus:border-[var(--blue)] focus:outline-none transition-all appearance-none bg-white"
                  disabled={loading || trip}
                >
                  <option value="">-</option>
                  <option value="Pablo Mendez">Pablo Mendez</option>
                  <option value="Gerardo Benitez">Gerardo Benitez</option>
                  <option value="Cristian Gonzalez">Cristian Gonzalez</option>
                </select>
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  Conductor
                </label>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[var(--blue)] focus:outline-none transition-all appearance-none bg-white"
                  disabled={loading}
                >
                  <option value="">-</option>
                  <option value="Planta A">Planta A</option>
                  <option value="Planta B">Planta B</option>
                  <option value="Planta C">Planta C</option>
                </select>
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  Origen
                </label>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[var(--blue)] focus:outline-none transition-all appearance-none bg-white"
                  disabled={loading}
                >
                  <option value="">-</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Santa Fe">Santa Fe</option>
                </select>
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  Destino
                </label>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[var(--blue)] focus:outline-none transition-all appearance-none bg-white"
                  disabled={loading}
                >
                  <option value="">-</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Biodiesel">Biodiesel</option>
                  <option value="GNC">GNC</option>
                </select>
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  Combustible
                </label>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="liters"
                  value={formData.liters}
                  onChange={handleChange}
                  className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[var(--blue)] focus:outline-none transition-all placeholder-transparent"
                  placeholder="Litros"
                  disabled={loading}
                />
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[var(--blue)]">
                  Litros
                </label>
              </div>
              <div className="relative col-span-2">
                <input
                  type="datetime-local"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  min={formatDateToDatetimeLocal(new Date())}
                  className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-xl disabled:bg-gray-100 disabled:pointer-events-none focus:border-[var(--blue)] focus:outline-none transition-all"
                  disabled={loading || trip}
                />
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  Fecha de Salida
                </label>
              </div>
            </div>

            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[var(--blue)] focus:outline-none transition-all appearance-none bg-white"
                disabled={loading}
              >
                <option value="">-</option>
                <option value="sin_iniciar">Sin iniciar</option>
                <option value="en_transito">En tránsito</option>
                <option value="cancelado">Cancelado</option>
                <option value="completado">Completado</option>
              </select>
              <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                Estado
              </label>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-[var(--orange)] rounded-xl hover:bg-[var(--orange-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </span>
                ) : trip ? (
                  "Guardar cambios"
                ) : (
                  "Crear viaje"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripModal;
