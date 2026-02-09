import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create proper headers for better-auth
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
      });

      const session = await betterAuth.api.getSession({
        headers,
      });

      if (!session) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No valid session found" });
      }

      if (!session.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      if (!session.user.role) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }
      if (!roles.includes(session.user.role)) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }

      req.user = session.user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Authentication failed" });
    }
  };
};
