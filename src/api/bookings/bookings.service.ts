import { prisma } from "../../lib/prisma";
import { createBookingParams } from "../../types/bookings";

const createBooking = async ({
  date,
  end_time,
  start_time,
  student_id,
  tutor_id,
  total_price,
}: createBookingParams) => {
  return prisma.booking.create({
    data: {
      date,
      end_time,
      start_time,
      student_id,
      tutor_id,
      total_price,
    },
  });
};

const getTeachersBooking = async (id: string, take: number, skip: number) => {
  const result = await prisma.booking.findMany({
    where: {
      tutor_id: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });

  const count = await prisma.booking.count({ where: { tutor_id: id } });
  return {
    bookings: result,
    total: count,
  };
};

const getStudentsBooking = async (id: string, take: number, skip: number) => {
  const result = await prisma.booking.findMany({
    where: {
      student_id: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });
  const count = await prisma.booking.count({ where: { student_id: id } });
  return {
    bookings: result,
    total: count,
  };
};

const getBookingDetails = async (id: string) => {
  return prisma.booking.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

const getATutorPrice = async (id: string) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    select: {
      price_per_hour: true,
    },
  });
};

export const BookingsServices = {
  createBooking,
  getStudentsBooking,
  getBookingDetails,
  getATutorPrice,
  getTeachersBooking,
};
