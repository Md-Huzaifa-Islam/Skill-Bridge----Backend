import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import { appError } from "../../types/appError";
import { AuthServices } from "./auth.service";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role = UserRoles.student } = req.body;

    //   email and name are required
    if (!name || !email || !password) {
      const error = new Error(
        "Name, email and password are required",
      ) as appError;
      error.status = 400;
      return next(error);
    }

    // stop creating admin user
    if (role == UserRoles.admin) {
      const error = new Error(
        "You are not allowed to create an admin user",
      ) as appError;
      error.status = 403;
      return next(error);
    }
    const result = await AuthServices.register({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.user,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      const duplicateError = new Error("Email already exists") as appError;
      duplicateError.status = 400;
      return next(duplicateError);
    }
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    //   email and name are required
    if (!email || !password) {
      const error = new Error("Email and password are required") as appError;
      error.status = 400;
      return next(error);
    }

    const result = await AuthServices.login({ email, password });

    // Manually set session cookie if token is present
    if (result?.token) {
      res.cookie("skill_bridge.session_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

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
    next(error);
  }
};

export const AuthControllers = {
  register,
  login,
  details,
};
