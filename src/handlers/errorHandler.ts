import { NextFunction, Request, Response } from "express";
import { appError } from "../types/appError";

export const errorHandler = (
  error: appError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  // Ensure status is a valid number
  const statusCode =
    typeof error.status === "number" &&
    error.status >= 100 &&
    error.status < 600
      ? error.status
      : typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
