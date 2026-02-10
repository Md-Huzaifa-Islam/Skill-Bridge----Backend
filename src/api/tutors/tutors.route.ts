import { Router } from "express";
import { TutorsControllers } from "./tutors.controller";

const router = Router();

// get all tutors (public)
router.get("/", TutorsControllers.getAllTutors);

// get a tutor details (public)
router.get("/:id", TutorsControllers.getATutor);

export { router as TutorsRoutes };
