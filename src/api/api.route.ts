import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
import { TutorsRoutes } from "./tutors/tutors.route";
import { CategoriesRoutes } from "./categories/categories.route";
import { BookingsRoutes } from "./bookings/bookings.route";
import { TutorRoutes } from "./tutor/tutor.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";

const router = Router();

// admin route

// auth route
// router.use("/auth", AuthRoutes);
// auth handlers
router.all("/auth/*splat", toNodeHandler(auth));

// bookings route
router.use("/bookings", BookingsRoutes);

// categories route
router.use("/categories", CategoriesRoutes);

// tutor route
router.use("/tutor", TutorRoutes);

// tutors route
router.use("/tutors", TutorsRoutes);

export { router as ApiRoutes };
