import { Schema, model, Document } from "mongoose";
import { ITrip } from "../interfaces/trip.interface";

interface TripDocument extends ITrip, Document {
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<TripDocument>(
  {
    departureDate: {
      type: Date,
      required: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    driver: {
      type: String,
      required: true,
      trim: true,
    },
    fuel: {
      type: String,
      required: true,
      trim: true,
      enum: ["Diesel", "Gasolina", "GNC", "Biodiesel"],
    },
    liters: {
      type: String,
      required: true,
      trim: true,
    },
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: ["sin_iniciar", "en_transito", "completado", "cancelado"],
      default: "sin_iniciar",
    },
    truck: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Trip = model<TripDocument>("Trip", tripSchema);
