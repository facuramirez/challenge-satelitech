import { Request, Response } from "express";
import { User } from "../models/User";
import { generateTokens } from "../middleware/auth";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen email y password
    if (!email || !password) {
      return res.status(400).json({
        message: "Por favor, proporciona email y contraseña",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar tokens incluyendo el rol
    const { accessToken, refreshToken } = await generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || "user", // Valor por defecto "user" si no existe
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

    return res.json({
      message: "Login exitoso",
      user: {
        email: user.email,
        role: user.role,
        token: accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt");
    res.clearCookie("refreshToken");

    if (req.user) {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    return res.json({ message: "Logout exitoso" });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
