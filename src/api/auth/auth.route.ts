import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

// register route
router.post("/register", AuthControllers.register);

// login route
router.post("/login", AuthControllers.login);

// details route
router.get("/me", AuthControllers.details);

export { router as AuthRoutes };
