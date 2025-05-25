import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userController";
import { auth, isAdmin } from "../middleware/auth";

const router = express.Router();

// Todas las rutas requieren autenticación
// router.use(auth);

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.post("/", createUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, isAdmin, deleteUser);

export default router;
