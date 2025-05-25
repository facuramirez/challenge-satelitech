import { useEffect, useState } from "react";
import useTripStore from "../store/useTripStore";
import { formatDateToDatetimeLocal } from "../utils/formatDatePicker";

export const Filters = () => {
  const { fetchTrips, setLoading } = useTripStore();
  const [filters, setFilters] = useState({});
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Debounce: espera 300ms antes de aplicar los filtros
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => {
      clearTimeout(handler); // limpia el timeout anterior si el usuario sigue escribiendo
    };
  }, [filters]);

  // Solo se llama cuando debouncedFilters cambia (después del delay)
  useEffect(() => {
    const getFilters = async () => {
      try {
        setLoading(true);
        await fetchTrips(debouncedFilters);
      } catch (error) {
        // console.error("Error al aplicar los filtros:", error);
      } finally {
        setLoading(false);
      }
    };

    getFilters();
  }, [debouncedFilters]);

  return (
    <div className="flex flex-col gap-4 p-6 shadow shadow-sm">
      <span className="text-lg font-bold text-gray-700">Filtros:</span>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-4">
        <label htmlFor="truck">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Camión</span>
            <select
              id="truck"
              name="truck"
              onChange={handleChange}
              className="mt-0.5 w-full rounded border-gray-300 pe-10 bg-gray-100 sm:text-sm outline-none py-2 px-4 appearance-none"
            >
              <option value="">Todos</option>
              <option value="ABC123">ABC123</option>
              <option value="JYU246">JYU246</option>
              <option value="KUN946">KUN946</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 top-8 flex items-center">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </label>

        <label htmlFor="driver">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Conductor</span>
            <input
              type="text"
              autoComplete="off"
              id="driver"
              name="driver"
              onChange={handleChange}
              placeholder="Nombre..."
              className="mt-0.5 w-full rounded border-gray-300 bg-gray-100 pe-10 shadow-none sm:text-sm outline-none py-2 px-4 appearance-none"
            />

            <span className="absolute inset-y-0 right-1 top-8 grid w-8 place-content-center">
              <button
                type="button"
                aria-label="Submit"
                className="rounded-full p-1.5 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </span>
          </div>
        </label>

        <label htmlFor="status">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Estado</span>
            <select
              id="status"
              name="status"
              onChange={handleChange}
              className="mt-0.5 w-full rounded border-gray-300 pe-10 bg-gray-100 sm:text-sm outline-none py-2 px-4 appearance-none"
            >
              <option value="">Todos</option>
              <option value="sin_iniciar">Sin iniciar</option>
              <option value="en_transito">En tránsito</option>
              {/* <option value="cancelado">Cancelado</option> */}
              <option value="completado">Completado</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 top-8 flex items-center">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </label>

        <label htmlFor="minLiters">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Litros (mínimo)</span>
            <input
              type="number"
              autoComplete="off"
              id="minLiters"
              name="minLiters"
              onChange={handleChange}
              placeholder="Litros..."
              className="mt-0.5 w-full rounded border-gray-300 bg-gray-100 pe-10 shadow-none sm:text-sm outline-none py-2 px-4"
            />
          </div>
        </label>

        <label htmlFor="maxLiters">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Litros (máximo)</span>
            <input
              type="number"
              autoComplete="off"
              id="maxLiters"
              name="maxLiters"
              onChange={handleChange}
              placeholder="Litros..."
              className="mt-0.5 w-full rounded border-gray-300 bg-gray-100 pe-10 shadow-none sm:text-sm outline-none py-2 px-4"
            />
          </div>
        </label>

        <label htmlFor="fuel">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Combustible</span>
            <select
              id="fuel"
              name="fuel"
              onChange={handleChange}
              className="mt-0.5 w-full rounded border-gray-300 pe-10 bg-gray-100 sm:text-sm outline-none py-2 px-4 appearance-none"
            >
              <option value="">Todos</option>
              <option value="Diesel">Diesel</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Biodiesel">Biodiesel</option>
              <option value="GNC">GNC</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 top-8 flex items-center">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </label>

        <label htmlFor="initDepartureDate">
          <div className="relative flex flex-col gap-2">
            <div className="relative col-span-2">
              <span className="text-sm text-gray-500 ml-1">
                Fecha de salida (mínimo)
              </span>
              <input
                id="initDepartureDate"
                type="datetime-local"
                name="initDepartureDate"
                onChange={handleChange}
                defaultValue={formatDateToDatetimeLocal(
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                )}
                min={formatDateToDatetimeLocal(
                  new Date(new Date().getFullYear(), 0, 1)
                )}
                className="mt-1.5 bg-gray-100 text-sm peer w-full px-4 py-2 shadow-none rounded-sm focus:border-[var(--blue)] focus:outline-none transition-all"
              />
              {/* <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                Fecha de Salida
              </label> */}
            </div>
          </div>
        </label>

        <label htmlFor="endDepartureDate">
          <div className="relative flex flex-col gap-2">
            <div className="relative col-span-2">
              <span className="text-sm text-gray-500 ml-1">
                Fecha de salida (máximo)
              </span>
              <input
                id="endDepartureDate"
                type="datetime-local"
                name="endDepartureDate"
                onChange={handleChange}
                defaultValue={formatDateToDatetimeLocal(new Date())}
                min={formatDateToDatetimeLocal(
                  new Date(new Date().getFullYear(), 0, 1)
                )}
                className="mt-1.5 bg-gray-100 text-sm peer w-full px-4 py-2 shadow-none rounded-sm focus:border-[var(--blue)] focus:outline-none transition-all"
              />
              {/* <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600">
                Fecha de Salida
              </label> */}
            </div>
          </div>
        </label>

        <label htmlFor="origin">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Origen</span>
            <select
              id="origin"
              name="origin"
              onChange={handleChange}
              className="mt-0.5 w-full rounded border-gray-300 pe-10 bg-gray-100 sm:text-sm outline-none py-2 px-4 appearance-none"
            >
              <option value="">Todos</option>
              <option value="Planta A">Planta A</option>
              <option value="Planta B">Planta B</option>
              <option value="Planta C">Planta C</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 top-8 flex items-center">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};
