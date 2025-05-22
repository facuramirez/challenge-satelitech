import { Request, Response } from 'express';
import { Viaje, IViaje } from '../models/Viaje';

type EstadoViaje = 'Pendiente' | 'En tránsito' | 'Completado' | 'Cancelado';
type TransicionesEstado = Record<EstadoViaje, EstadoViaje[]>;

const LIMITE_MAXIMO_LITROS = 30000;

export const getAllViajes = async (req: Request, res: Response) => {
  try {
    const viajes = await Viaje.find().sort({ fecha_salida: -1 });
    res.json(viajes);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const createViaje = async (req: Request, res: Response) => {
  try {
    const viajeData: IViaje = req.body;
    
    // Validaciones de negocio
    const errores = [];

    // Validar cantidad de litros
    if (viajeData.cantidad_litros <= 0) {
      errores.push('La cantidad de litros debe ser mayor a 0');
    }
    if (viajeData.cantidad_litros > LIMITE_MAXIMO_LITROS) {
      errores.push(`La cantidad de litros no puede superar los ${LIMITE_MAXIMO_LITROS} litros`);
    }

    // Validar fecha de salida
    const fechaSalida = new Date(viajeData.fecha_salida);
    const ahora = new Date();
    
    // Resetear las horas, minutos y segundos para comparar solo fechas
    ahora.setHours(0, 0, 0, 0);
    const fechaSalidaSinHora = new Date(fechaSalida);
    fechaSalidaSinHora.setHours(0, 0, 0, 0);

    if (fechaSalidaSinHora < ahora) {
      errores.push('La fecha de salida no puede ser en el pasado');
    }

    // Si hay errores, retornar todos juntos
    if (errores.length > 0) {
      return res.status(400).json({ 
        message: 'Error en la validación',
        errores 
      });
    }

    const viaje = new Viaje(viajeData);
    await viaje.save();
    res.status(201).json(viaje);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updateViaje = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<IViaje> = req.body;
    
    // No permitir actualizar el ID
    delete updateData.id;
    
    const viaje = await Viaje.findOne({ id });
    if (!viaje) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    // Validaciones de negocio para actualización
    const errores = [];

    // Validar cantidad de litros si se está actualizando
    if (updateData.cantidad_litros !== undefined) {
      if (updateData.cantidad_litros <= 0) {
        errores.push('La cantidad de litros debe ser mayor a 0');
      }
      if (updateData.cantidad_litros > LIMITE_MAXIMO_LITROS) {
        errores.push(`La cantidad de litros no puede superar los ${LIMITE_MAXIMO_LITROS} litros`);
      }
    }

    // Validar fecha de salida si se está actualizando
    if (updateData.fecha_salida) {
      const fechaSalida = new Date(updateData.fecha_salida);
      const ahora = new Date();
      
      ahora.setHours(0, 0, 0, 0);
      const fechaSalidaSinHora = new Date(fechaSalida);
      fechaSalidaSinHora.setHours(0, 0, 0, 0);

      if (fechaSalidaSinHora < ahora) {
        errores.push('La fecha de salida no puede ser en el pasado');
      }
    }

    // Validar el cambio de estado
    if (updateData.estado) {
      const estadosValidos: TransicionesEstado = {
        'Pendiente': ['En tránsito', 'Cancelado'],
        'En tránsito': ['Completado', 'Cancelado'],
        'Completado': [],
        'Cancelado': []
      };

      const estadoActual = viaje.estado as EstadoViaje;
      const nuevoEstado = updateData.estado as EstadoViaje;

      if (!estadosValidos[estadoActual].includes(nuevoEstado)) {
        errores.push(`No se puede cambiar el estado de ${estadoActual} a ${nuevoEstado}`);
      }
    }

    // Si hay errores, retornar todos juntos
    if (errores.length > 0) {
      return res.status(400).json({ 
        message: 'Error en la validación',
        errores 
      });
    }

    Object.assign(viaje, updateData);
    await viaje.save();

    res.json(viaje);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const deleteViaje = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const viaje = await Viaje.findOne({ id });
    if (!viaje) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    if (viaje.estado === 'En tránsito') {
      return res.status(400).json({ 
        message: 'No se puede eliminar un viaje en tránsito' 
      });
    }

    viaje.estado = 'Cancelado';
    await viaje.save();

    res.json({ message: 'Viaje cancelado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const getViajeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const viaje = await Viaje.findOne({ id });
    if (!viaje) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    res.json(viaje);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
}; 