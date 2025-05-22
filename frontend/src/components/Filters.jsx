export const Filters = () => {
  return (
    <div className="flex flex-col gap-4 p-6 shadow shadow-sm">
      <span className="text-lg font-bold text-gray-700">Filtros:</span>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-4">
        <label htmlFor="truck">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Por camión</span>
            <select
              id="truck"
              className="mt-0.5 w-full rounded border-gray-300 pe-10 bg-gray-100 sm:text-sm outline-none py-2 px-4 appearance-none"
            >
              <option value="all">Todos</option>
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

        <label htmlFor="conductor">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Por conductor</span>
            <input
              type="text"
              autoComplete="off"
              id="conductor"
              placeholder="Nombre..."
              className="mt-0.5 w-full rounded border-gray-300 bg-gray-100 pe-10 shadow-sm sm:text-sm outline-none py-2 px-4 appearance-none"
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

        <label htmlFor="liters">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Por conductor</span>
            <input
              type="number"
              autoComplete="off"
              id="liters"
              placeholder="Litros..."
              className="mt-0.5 w-full rounded border-gray-300 bg-gray-100 pe-10 shadow-sm sm:text-sm outline-none py-2 px-4"
            />
          </div>
        </label>

        <label htmlFor="station">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Por estado</span>
            <select
              id="station"
              className="mt-0.5 w-full rounded border-gray-300 pe-10 bg-gray-100 sm:text-sm outline-none py-2 px-4 appearance-none"
            >
              <option value="all">Todos</option>
              <option value="0">Sin iniciar</option>
              <option value="1">En tránsito</option>
              <option value="2">Cancelado</option>
              <option value="3">Completado</option>
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

        <label htmlFor="fuel">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Por combustible</span>
            <select
              id="fuel"
              className="mt-0.5 w-full rounded border-gray-300 pe-10 bg-gray-100 sm:text-sm outline-none py-2 px-4 appearance-none"
            >
              <option value="all">Todos</option>
              <option value="0">Sin iniciar</option>
              <option value="1">En tránsito</option>
              <option value="2">Completado</option>
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

        <label htmlFor="origin">
          <div className="relative flex flex-col gap-2">
            <span className="text-sm text-gray-500 ml-1">Por origen</span>
            <select
              id="origin"
              className="mt-0.5 w-full rounded border-gray-300 pe-10 bg-gray-100 sm:text-sm outline-none py-2 px-4 appearance-none"
            >
              <option value="all">Todos</option>
              <option value="0">Planta A</option>
              <option value="1">Planta B</option>
              <option value="2">Planta C</option>
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
