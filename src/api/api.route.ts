import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
import { BookingsRoutes } from "./bookings/bookings.route";
import { CategoriesRoutes } from "./categories/categories.route";
import { TutorRoutes } from "./tutor/tutor.route";
import { TutorsRoutes } from "./tutors/tutors.route";

const router = Router();

// admin route

// auth route
router.use("/auth", AuthRoutes);

// bookings route
router.use("/bookings", BookingsRoutes);

// categories route
router.use("/categories", CategoriesRoutes);

// tutor route
router.use("/tutor", TutorRoutes);

// tutors route
router.use("/tutors", TutorsRoutes);

export { router as ApiRoutes };
