import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IViaje {
  id: string;
  camion: string;
  conductor: string;
  origen: string;
  destino: string;
  combustible: string;
  cantidad_litros: number;
  fecha_salida: Date;
  estado: 'Pendiente' | 'En tránsito' | 'Completado' | 'Cancelado';
}

const viajeSchema = new mongoose.Schema<IViaje>({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },
  camion: {
    type: String,
    required: true,
  },
  conductor: {
    type: String,
    required: true,
  },
  origen: {
    type: String,
    required: true,
  },
  destino: {
    type: String,
    required: true,
  },
  combustible: {
    type: String,
    required: true,
  },
  cantidad_litros: {
    type: Number,
    required: true,
    min: 0,
  },
  fecha_salida: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'En tránsito', 'Completado', 'Cancelado'],
    default: 'Pendiente',
  }
}, { timestamps: true });

export const Viaje = mongoose.model<IViaje>('Viaje', viajeSchema); 