import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router();

// register route
router.post("/register", AuthControllers.register);

// login route
router.post("/login", AuthControllers.login);

// details route
router.get(
  "/me",
  auth(UserRoles.admin, UserRoles.student, UserRoles.teacher),
  AuthControllers.details,
);

// verify route
router.get("/verify", AuthControllers.verifyEmail);

// logout route
router.get(
  "/logout",
  auth(UserRoles.admin, UserRoles.student, UserRoles.teacher),
  AuthControllers.logoutUser,
);

export { router as AuthRoutes };
