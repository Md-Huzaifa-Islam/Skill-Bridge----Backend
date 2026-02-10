import { Router } from "express";
import { BookingsControllers } from "./bookings.controller";
import { auth } from "../../middleware/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router();

// create a booking (student)
router.post("/", auth(UserRoles.student), BookingsControllers.createBooking);

// get users bookings (student or tutor)
router.get(
  "/",
  auth(UserRoles.teacher, UserRoles.student),
  BookingsControllers.getUsersBooking,
);

// get booking details (auth all)
router.get(
  "/:id",
  auth(UserRoles.admin, UserRoles.student, UserRoles.teacher),
  BookingsControllers.getBookingDetails,
);

export { router as BookingsRoutes };
