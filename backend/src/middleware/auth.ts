import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth2 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

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

    req.user = user;
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
          });

        // Enviamos nuevo token como cookie
        res.cookie("jwt", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 0.5 * 60 * 1000, // 15 minutos
        });

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });

        req.user = user;
        return next();
      } catch (refreshErr) {
        return res.status(401).json({ message: "Invalid refreshToken" });
      }
    }

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const generateTokens = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const accessToken = jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign(
    { userId, email },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};
