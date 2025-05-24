import { Request, Response } from "express";

export const healthCheck = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "All is OK!",
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};
