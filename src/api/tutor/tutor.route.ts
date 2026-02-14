import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { TutorControllers } from "./tutor.controller";

const router = Router();

// update tutors profiles each part except isFeatured and availability
router.put("/profile", auth(UserRoles.teacher), TutorControllers.updateProfile);

// update availability
router.put(
  "/availability",
  auth(UserRoles.teacher),
  TutorControllers.updateAvailability,
);

export { router as TutorRoutes };
