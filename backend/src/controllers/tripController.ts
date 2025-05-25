import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { Trip } from "../models/Trip";
import { ITrip } from "../interfaces/trip.interface";

interface PaginatedRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    departureDate?: string;
    destination?: string;
    driver?: string;
    fuel?: string;
    liters?: string;
    origin?: string;
    status?: string;
    truck?: string;
  };
}

// Obtener todos los viajes con paginación y filtros
export const getTrips = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const skip = (page - 1) * limit;

    // Validar parámetros de paginación
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      res.status(400).json({
        message: "Los parámetros de paginación deben ser números positivos",
        error: "Invalid pagination parameters",
      });
      return;
    }

    const params = Object.entries(req.query).filter(
      ([key, value]) => value !== ""
    );

    const paramsToQuery: FilterQuery<ITrip> = {};
    params.forEach(([key, value]) => {
      // Si el campo es driver, usar regex para búsqueda parcial
      if (key === "driver") {
        paramsToQuery[key] = { $regex: value, $options: "i" };
      } else {
        paramsToQuery[key] = value;
      }
    });

    // Si ambos campos de fecha están presentes, agregar filtro por rango
    if (paramsToQuery.minLiters || paramsToQuery.maxLiters) {
      const exprFilter: any = {};

      if (paramsToQuery.minLiters) {
        exprFilter.$gte = [
          { $toDouble: "$liters" },
          parseFloat(paramsToQuery.minLiters),
        ];
      }

      if (paramsToQuery.maxLiters) {
        exprFilter.$lte = [
          { $toDouble: "$liters" },
          parseFloat(paramsToQuery.maxLiters),
        ];
      }

      if (paramsToQuery.minLiters && paramsToQuery.maxLiters) {
        // Combinar $gte y $lte en una sola expresión $and
        paramsToQuery.$expr = {
          $and: [
            {
              $gte: [
                { $toDouble: "$liters" },
                parseFloat(paramsToQuery.minLiters),
              ],
            },
            {
              $lte: [
                { $toDouble: "$liters" },
                parseFloat(paramsToQuery.maxLiters),
              ],
            },
          ],
        };
      } else {
        // Solo uno de los dos
        paramsToQuery.$expr = exprFilter;
      }
    }

    // Si ambos campos de fecha están presentes, agregar filtro por rango
    if (paramsToQuery.initDepartureDate && paramsToQuery.endDepartureDate) {
      paramsToQuery.departureDate = {
        $gte: new Date(paramsToQuery.initDepartureDate),
        $lte: new Date(paramsToQuery.endDepartureDate),
      };
    } else if (paramsToQuery.initDepartureDate) {
      paramsToQuery.departureDate = {
        $gte: new Date(paramsToQuery.initDepartureDate),
      };
    } else if (paramsToQuery.endDepartureDate) {
      paramsToQuery.departureDate = {
        $lte: new Date(paramsToQuery.endDepartureDate),
      };
    }

    delete paramsToQuery.minLiters;
    delete paramsToQuery.maxLiters;
    delete paramsToQuery.initDepartureDate;
    delete paramsToQuery.endDepartureDate;

    // Agregar condición para excluir status "cancelado"
    paramsToQuery.status = { $ne: "cancelado" };

    // Ejecutar consultas en paralelo para mejor rendimiento
    const [trips, total] = await Promise.all([
      Trip.find(paramsToQuery)
        .sort({ departureDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Trip.countDocuments(),
    ]);

    res.json({
      trips,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Error al obtener los viajes",
      error: err.message,
    });
  }
};

// Obtener un viaje por ID
export const getTripById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      res.status(404).json({ message: "Viaje no encontrado" });
      return;
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el viaje",
      error: (error as Error).message,
    });
  }
};

// Crear un nuevo viaje
export const createTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tripData: ITrip = req.body;

    // Validar campos requeridos
    const requiredFields: (keyof ITrip)[] = [
      "departureDate",
      "destination",
      "driver",
      "fuel",
      "liters",
      "origin",
      "truck",
    ];
    const missingFields = requiredFields.filter((field) => !tripData[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        message: "Faltan campos requeridos",
        missingFields,
      });
      return;
    }

    // Validar que los litros no excedan 30000
    if (Number(tripData.liters) > 30000) {
      res.status(400).json({
        message: "Error de validación",
        error: "La cantidad de litros no puede ser mayor a 30000",
      });
      return;
    }

    // Validar que la fecha de salida no sea anterior a la fecha actual
    const departureDate = new Date(tripData.departureDate);
    const currentDate = new Date();

    if (departureDate < currentDate) {
      res.status(400).json({
        message: "Error de validación",
        error: "La fecha de salida no puede ser anterior a la fecha actual",
      });
      return;
    }

    const trip = new Trip({
      ...tripData,
      status: tripData.status || "sin_iniciar",
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el viaje",
      error: (error as Error).message,
    });
  }
};

// Actualizar un viaje
export const updateTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tripData: Partial<ITrip> = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404).json({ message: "Viaje no encontrado" });
      return;
    }

    // Actualizar solo los campos proporcionados
    Object.assign(trip, tripData);

    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el viaje",
      error: (error as Error).message,
    });
  }
};

// Eliminar un viaje
export const deleteTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      res.status(404).json({ message: "Viaje no encontrado" });
      return;
    }
    res.json({ message: "Viaje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el viaje",
      error: (error as Error).message,
    });
  }
};
