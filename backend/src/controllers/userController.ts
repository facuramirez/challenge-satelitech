import { Request, Response } from "express";
import { User } from "../models/User";
import { IUser } from "../interfaces/user.interface";
import { generateTokens } from "../middleware/auth";

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios",
      error: (error as Error).message,
    });
  }
};

// Obtener un usuario por ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el usuario",
      error: (error as Error).message,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role = "user" } = req.body;

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de email inválido" });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Validar rol si se proporciona
    if (role && !["admin", "user"].includes(role)) {
      return res.status(400).json({
        message: "El rol debe ser 'admin' o 'user'",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Crear nuevo usuario
    const user = new User({ email, password, role });
    await user.save();

    // Generar tokens
    const { accessToken, refreshToken } = await generateTokens({
      userId: user._id.toString(),
      email,
      role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    // Establecer cookies
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        email: user.email,
        role: user.role,
        token: accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar un usuario
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData: Partial<IUser> = req.body;

    // Validar que el email sea único si se está actualizando
    if (userData.email) {
      const existingUser = await User.findOne({
        email: userData.email,
        _id: { $ne: req.params.id },
      });

      if (existingUser) {
        res.status(400).json({
          message: "El email ya está en uso por otro usuario",
        });
        return;
      }
    }

    // Validar rol si se proporciona
    if (userData.role && !["admin", "user"].includes(userData.role)) {
      res.status(400).json({
        message: "El rol debe ser 'admin' o 'user'",
      });
      return;
    }

    // Validar contraseña si se proporciona
    if (userData.password) {
      if (userData.password.length < 6) {
        res.status(400).json({
          message: "La contraseña debe tener al menos 6 caracteres",
        });
        return;
      }

      // Buscar el usuario para usar el método de hash del modelo
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      // Actualizar la contraseña en el usuario (esto activará el pre-save hook)
      user.password = userData.password;
      if (userData.email) user.email = userData.email;
      if (userData.role) user.role = userData.role;

      const savedUser = await user.save();

      // Crear un objeto de respuesta sin la contraseña
      const userResponse = {
        _id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };

      res.json(userResponse);
      return;
    }

    // Si no hay actualización de contraseña, actualizar normalmente
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: (error as Error).message,
    });
  }
};

// Eliminar un usuario
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Usuario no autenticado",
      });
      return;
    }

    // Verificar si el usuario a eliminar es el mismo que está autenticado
    const authenticatedUserId = req.user.userId;
    const userIdToDelete = req.params.id;

    if (authenticatedUserId === userIdToDelete) {
      res.status(400).json({
        message: "No puedes eliminar tu propio usuario",
      });
      return;
    }

    // Obtener el usuario a eliminar
    const userToDelete = await User.findById(userIdToDelete);
    if (!userToDelete) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    // Si el usuario a eliminar es admin, verificar que no sea el último
    if (userToDelete.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        res.status(400).json({
          message: "No puedes eliminar el último usuario administrador",
        });
        return;
      }
    }

    await userToDelete.deleteOne();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: (error as Error).message,
    });
  }
};
