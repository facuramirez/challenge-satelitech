import { useEffect, useState } from "react";
import { Title } from "./Title";
import useTripStore from "../store/useTripStore";
import { Chart } from "react-google-charts";
import { getFiltersAndMappedTrips } from "../utils/chartsData";
import ChartsSkeleton from "./ChartsSkeleton";

const colors = {
  10000: {
    colorFrom: "text-pink-400",
    colorTo: "text-pink-400",
  },
  "10000-19999": {
    colorFrom: "text-sky-400",
    colorTo: "text-sky-400",
  },
  "20000-30000": {
    colorFrom: "text-lime-400",
    colorTo: "text-lime-400",
  },
};

export const Statistics = () => {
  const { allTrips, fetchTrips } = useTripStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        await fetchTrips();
      } catch (error) {
        // console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  const { options, litersData, statusData, fuelData, originData } =
    getFiltersAndMappedTrips(allTrips);

  if (isLoading) {
    return <ChartsSkeleton />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 min-h-[calc(100vh-7rem)]">
      <Title title="Estadísticas" />
      {allTrips.length === 0 ? (
        <div className="flex justify-center items-center h-full my-auto mx-auto w-fit">
          <h1 className="lg:text-3xl text-2xl font-bold px-4 py-2">
            No hay viajes existentes.
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-center items-center md:grid-cols-2 gap-6 md:gap-12 lg:app-24">
          <div className="shadow-xl rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-gray-700">Litros:</span>
            <Chart
              chartType="PieChart"
              data={litersData}
              options={options("Litros")}
            />
          </div>

          <div className="shadow-xl rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-gray-700">Estado:</span>
            <Chart
              chartType="PieChart"
              data={statusData}
              options={options("Estado")}
            />
          </div>

          <div className="shadow-xl rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-gray-700">
              Combustible:
            </span>
            <Chart
              chartType="PieChart"
              data={fuelData}
              options={options("Combustible")}
            />
          </div>

          <div className="shadow-xl rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-gray-700">Origen:</span>
            <Chart
              chartType="PieChart"
              data={originData}
              options={options("Origen")}
            />
          </div>
        </div>
      )}
    </div>
  );
};
