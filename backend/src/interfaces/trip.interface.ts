export interface ITrip {
  departureDate: Date;
  destination: "Estación Y" | "Estación Z" | "Estación W";
  driver: string;
  fuel: "Diesel" | "Gasolina" | "GNC" | "Biodiesel";
  liters: string;
  origin: "Planta A" | "Planta B" | "Planta C";
  status: "sin_iniciar" | "en_transito" | "completado" | "cancelado";
  truck: string;
}

export interface ITripModel extends ITrip, Document {
  createdAt: Date;
  updatedAt: Date;
}
