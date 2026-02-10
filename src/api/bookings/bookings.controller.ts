import { NextFunction, Request, Response } from "express";
import { appError } from "../../types/appError";
import { BookingsServices } from "./bookings.service";
import { UserRoles } from "../../../generated/prisma/enums";
import { paginationHandler } from "../../handlers/paginationHandler";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tutor_id, student_id, start_time, end_time, date } = req.body;

    const requiredFields = { tutor_id, student_id, start_time, end_time, date };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        const error = new Error(
          `${key.replace("_", " ")} is required`,
        ) as appError;
        error.status = 400;
        return next(error);
      }
    }

    const formatDate = (dt: string) => new Date(dt).toLocaleDateString("en-CA"); // YYYY-MM-DD

    const formatTime = (dt: string) =>
      new Date(dt).toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

    const startDateTime = new Date(`${date}T${start_time}`);
    const endDateTime = new Date(`${date}T${end_time}`);

    const formattedDate = formatDate(date);
    const formattedStartTime = formatTime(startDateTime.toString());
    const formattedEndTime = formatTime(endDateTime.toString());

    if (startDateTime >= endDateTime) {
      const error = new Error(
        "Start time can't be after or equal to end time",
      ) as appError;
      error.status = 400;
      return next(error);
    }

    const now = new Date();
    if (startDateTime < now) {
      const error = new Error(
        "You can't create a booking in the past",
      ) as appError;
      error.status = 400;
      return next(error);
    }

    const tutorPrice = await BookingsServices.getATutorPrice(tutor_id);
    if (!tutorPrice) {
      const error = new Error("Tutor's price per hour is not set") as appError;
      error.status = 400;
      return next(error);
    }

    const diffMs = endDateTime.getTime() - startDateTime.getTime();
    const totalHours = Math.ceil(diffMs / (1000 * 60 * 60)); // ceil to full hours

    await BookingsServices.createBooking({
      tutor_id,
      student_id,
      date: formattedDate,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      total_price: totalHours * tutorPrice.price_per_hour,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
    });
  } catch (error: any) {
    next(error);
  }
};

const getUsersBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = req.user?.role;
    const { page, limit } = req.query;
    const { skip, take } = paginationHandler({
      page: typeof page === "string" ? page : undefined,
      limit: typeof limit === "string" ? limit : undefined,
    });
    if (role == UserRoles.teacher) {
      const result = await BookingsServices.getTeachersBooking(
        req.user?.id!,
        take,
        skip,
      );
      return res.status(200).json({
        success: true,
        message: "All bookings are fetched successfully.",
        date: result,
      });
    } else if (role == UserRoles.student) {
      const result = await BookingsServices.getStudentsBooking(
        req.user?.id!,
        take,
        skip,
      );
      return res.status(200).json({
        success: true,
        message: "All bookings are fetched successfully.",
        date: result.bookings,
        pagination: {
          total_page: Math.ceil(result.total / take),
          limit: take,
          page: skip / take + 1,
        },
      });
    } else {
      const error = new Error("Internal server error.") as appError;
      return next(error);
    }
  } catch (error: any) {
    next(error);
  }
};

const getBookingDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await BookingsServices.getBookingDetails(
      typeof id === "string" ? id : id[0],
    );

    res.status(200).json({
      success: true,
      message: "Booking details fetched successfully.",
      data: result,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      const error = new Error(`Booking details couldn't found`) as appError;
      error.status = 404;
      return next(error);
    }

    next(error);
  }
};

export const BookingsControllers = {
  createBooking,
  getUsersBooking,
  getBookingDetails,
};
