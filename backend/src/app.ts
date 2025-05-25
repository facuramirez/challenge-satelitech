import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import tripsRoutes from "./routes/tripRoutes";
import userRoutes from "./routes/userRoutes";
import healthCheckRoutes from "./routes/healthCheckRoutes";
import { auth } from "./middleware/auth";
import { User } from "./models/User";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Routes
app.use("/api/info", healthCheckRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/trips", auth, tripsRoutes);
app.use("/api/users", userRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Verificar si existe el usuario admin
    const adminEmail = "admin@satelitech.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      try {
        // Crear usuario admin directamente
        const adminUser = new User({
          email: adminEmail,
          password: "123456",
          role: "admin",
        });

        await adminUser.save();
        console.log("Usuario admin creado exitosamente");
      } catch (error) {
        console.error("Error al crear usuario admin:", error);
      }
    }
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!" });
  }
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
