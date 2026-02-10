import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
import { TutorsRoutes } from "./tutors/tutors.route";
import { CategoriesRoutes } from "./categories/categories.route";

const router = Router();

// admin route

// auth route
router.use("/auth", AuthRoutes);
// bookings route

// categories route
router.use("/categories", CategoriesRoutes);

// tutor route

// tutors route
router.use("/tutors", TutorsRoutes);

export { router as ApiRoutes };
