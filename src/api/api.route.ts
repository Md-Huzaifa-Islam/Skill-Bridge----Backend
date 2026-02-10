import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
import { TutorsRoutes } from "./tutors/tutors.route";

const router = Router();

// admin route

// auth route
router.use("/auth", AuthRoutes);
// bookings route

// categories route

// tutor route

// tutors route
router.use("/tutors", TutorsRoutes);

export { router as ApiRoutes };
