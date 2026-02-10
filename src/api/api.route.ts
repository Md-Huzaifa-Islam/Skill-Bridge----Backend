import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
import { TutorsRoutes } from "./tutors/tutors.route";
import { CategoriesRoutes } from "./categories/categories.route";
import { BookingsRoutes } from "./bookings/bookings.route";

const router = Router();

// admin route

// auth route
router.use("/auth", AuthRoutes);

// bookings route
router.use("/bookings", BookingsRoutes);

// categories route
router.use("/categories", CategoriesRoutes);

// tutor route

// tutors route
router.use("/tutors", TutorsRoutes);

export { router as ApiRoutes };
