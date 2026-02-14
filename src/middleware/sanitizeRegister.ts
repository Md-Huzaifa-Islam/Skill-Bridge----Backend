import { Request, Response, NextFunction } from "express";
import { UserRoles } from "../../generated/prisma/enums";

export const sanitizeRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Remove any role sent from frontend
  if (req.body.role == UserRoles.admin) {
    if (req.body?.role === "admin") {
      return res.status(403).json({
        message: "Admin role cannot be assigned during registration",
      });
    }
  }

  next();
};
