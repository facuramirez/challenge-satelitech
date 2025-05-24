import { Router } from "express";
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../controllers/tripController";
import { auth } from "../middleware/auth";

const router = Router();

// Rutas protegidas que requieren autenticación
router.use(auth);

// Obtener todos los viajes
router.get("/", getTrips);

// Obtener un viaje específico
router.get("/:id", getTripById);

// Crear un nuevo viaje
router.post("/", createTrip);

// Actualizar un viaje
router.put("/:id", updateTrip);

// Eliminar un viaje
router.delete("/:id", deleteTrip);

export default router;
