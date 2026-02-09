import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";

const router = Router();

// admin route

// auth route
router.use("/auth", AuthRoutes);
// bookings route

// categories route

// tutor route

// tutors route

export { router as ApiRoutes };
