import { NextFunction, Request, Response } from "express";
import { appError } from "../../types/appError";
import { AuthServices } from "./auth.service";

const details = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error("User not authenticated") as appError;
      error.status = 401;
      return next(error);
    }

    const result = await AuthServices.details(userId);

    if (!result) {
      const error = new Error("User not found") as appError;
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const AuthControllers = {
  details,
};
