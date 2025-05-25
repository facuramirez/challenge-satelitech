import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { auth, generateTokens } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/refresh", auth, async (req, res) => {
  try {
    const { _id, email } = req.user;
    const { accessToken: newToken, refreshToken: newRefreshToken } =
      await generateTokens({
        userId: _id,
        email,
      });

    // Establecer las nuevas cookies
    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 30 segundos
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: "Error al renovar el token" });
  }
});

export default router;
