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

    if (!email || !password) {
      const error = new Error("Email and password are required") as appError;
      error.status = 400;
      return next(error);
    }

    const result = await AuthServices.login({ password, email });

    if (!result) {
      const error = new Error("Invalid credentials") as appError;
      error.status = 401;
      return next(error);
    }

    // Copy cookies from better-auth Response to Express response
    const setCookieHeader = result.headers.get("set-cookie");
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    const data = await result.json();

    // Check if login was successful based on HTTP status
    const isSuccess = result.status >= 200 && result.status < 300;

    if (!isSuccess) {
      const error = new Error(
        data?.message || data?.error || "Invalid email or password",
      ) as appError;
      error.status = result.status;
      return next(error);
    }

    // Extract session token from Set-Cookie header for frontend to use
    let sessionToken = null;
    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(
        /skill_bridge\.session_token=([^;]+)/,
      );
      if (tokenMatch) {
        sessionToken = tokenMatch[1];
      }
    }

    return res.status(result.status).json({
      success: true,
      message: "Login successful",
      data: {
        user: data.user,
        token: data.token,
      },
    });
  } catch (error: any) {
    return next(error);
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
    return next(error);
  }
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      const error = new Error("Verification token is required") as appError;
      error.status = 400;
      return next(error);
    }

    const result = await AuthServices.verifyEmail(token);

    if (!result) {
      const error = new Error("Failed to verify email") as appError;
      error.status = 400;
      return next(error);
    }

    const data = await result.json();

    // Check if verification was successful based on HTTP status
    const isSuccess = result.status >= 200 && result.status < 300;

    if (!isSuccess) {
      const error = new Error(
        data?.message ||
          data?.error ||
          "Email verification failed. The link may have expired.",
      ) as appError;
      error.status = result.status;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    return next(error);
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Convert Express headers to Headers object for better-auth
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        headers.set(key, value.join(", "));
      }
    });

    const result = await AuthServices.logoutUser(headers);

    if (result) {
      // Copy cookies from better-auth Response to Express response
      const setCookieHeader = result.headers.get("set-cookie");
      if (setCookieHeader) {
        res.setHeader("Set-Cookie", setCookieHeader);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return next(error);
  }
};

export const AuthControllers = {
  register,
  login,
  details,
  verifyEmail,
  logoutUser,
};
