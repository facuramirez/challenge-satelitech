import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateTokens } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const user = new User({ email, password });
    await user.save();

    // Generar tokens
    const { accessToken, refreshToken } = await generateTokens(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    // Establecer cookies
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutos
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: { email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const { accessToken, refreshToken } = await generateTokens(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutos
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({ message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
}; 