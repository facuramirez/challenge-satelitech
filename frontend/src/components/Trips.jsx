import { Title } from "./Title";
import { Filters } from "./Filters";
import { TripsTable } from "./TripsTable";

export const Trips = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Title title="Viajes" />
      <Filters />
      <TripsTable />
    </div>
  );
};
