import { Request, Response } from "express";
import { appError } from "../types/appError";

export const errorHandler = (error: appError, req: Request, res: Response) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
