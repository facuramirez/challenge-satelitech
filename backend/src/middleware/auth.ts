import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  const refreshToken = req.cookies.refreshToken;

  if (!token && !refreshToken) {
    return res
      .status(401)
      .json({ message: "No token or refreshToken provided" });
  }

  try {
    // Verificamos el token principal
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Creamos el objeto user con la estructura correcta
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role || "user", // Valor por defecto si role es undefined
    };

    return next();
  } catch (err: any) {
    // Si el token expiró, intentamos con el refreshToken
    if (refreshToken) {
      try {
        const refreshDecoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        ) as jwt.JwtPayload;

        const user = await User.findById(refreshDecoded.userId);

        if (!user) {
          return res.status(401).json({ message: "User not found (refresh)" });
        }

        // Generamos un nuevo token de acceso
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateTokens({
            userId: user._id.toString(),
            email: user.email,
            role: user.role || "user", // Valor por defecto si role es undefined
          });

        // Enviamos nuevo token como cookie
        res.cookie("jwt", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 minutos
        });

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });

        // Creamos el objeto user con la estructura correcta
        req.user = {
          userId: user._id.toString(),
          email: user.email,
          role: user.role || "user", // Valor por defecto si role es undefined
        };

        return next();
      } catch (refreshErr) {
        return res.status(401).json({ message: "Invalid refreshToken" });
      }
    }

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware para verificar rol de administrador
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Acceso denegado. Se requiere rol de administrador",
      });
    }

    next();
  } catch (error) {
    console.error("Error en isAdmin middleware:", error);
    res
      .status(500)
      .json({ message: "Error al verificar rol de administrador" });
  }
};

export const generateTokens = async ({
  userId,
  email,
  role,
}: {
  userId: string;
  email: string;
  role: string;
}) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "10s",
    }
  );

  const refreshToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};
