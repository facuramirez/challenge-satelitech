export interface ITrip {
  departureDate: Date;
  destination: string;
  driver: string;
  fuel: "Diesel" | "Gasolina" | "GNC" | "Biodiesel";
  liters: string;
  origin: string;
  status: "sin_iniciar" | "en_transito" | "completado" | "cancelado";
  truck: string;
}

export interface ITripModel extends ITrip, Document {
  createdAt: Date;
  updatedAt: Date;
}
