import { NextFunction, Request, Response } from "express";
import { appError } from "../../types/appError";

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const TutorControllers = {
  updateProfile,
  updateAvailability,
};
