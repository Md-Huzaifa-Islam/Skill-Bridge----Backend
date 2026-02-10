import { getAllTutorsParams } from "../../types/tutors";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

const getAllTutors = async ({
  search,
  sortBy,
  sortOrder,
  category,
  isFeatured,
  skip,
  take,
}: getAllTutorsParams) => {
  const andConditions: Prisma.TutorProfileWhereInput[] = [];

  // Filter out banned users
  andConditions.push({ user: { is_banned: false } });

  if (isFeatured) {
    andConditions.push({ is_featured: isFeatured });
  }

  if (category) {
    andConditions.push({ category_id: category });
  }

  if (search) {
    andConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const where: Prisma.TutorProfileWhereInput = {
    AND: andConditions,
  };

  const orderBy: Prisma.TutorProfileOrderByWithRelationInput[] = [
    { is_featured: "desc" },
  ];

  if (sortBy === "name") {
    orderBy.push({ user: { name: sortOrder } });
  } else {
    orderBy.push({ [sortBy]: sortOrder });
  }

  // Query tutors with all filters and sorting
  const tutors = await prisma.tutorProfile.findMany({
    where,
    orderBy,
    skip,
    take,
    select: {
      id: true,
      description: true,
      price_per_hour: true,
      is_featured: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      bookings: {
        select: {
          rating: {
            select: {
              rating: true,
            },
          },
        },
        where: {
          rating: {
            isNot: null,
          },
        },
      },
    },
  });

  // Calculate average rating for each tutor
  const tutorsWithRating = tutors.map((tutor) => {
    const ratings = tutor.bookings
      .map((booking) => booking.rating?.rating)
      .filter(
        (rating): rating is number => rating !== null && rating !== undefined,
      );

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    const { bookings, ...tutorData } = tutor;

    return {
      ...tutorData,
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
    };
  });

  // Get total count for pagination
  const total = await prisma.tutorProfile.count({ where });

  return {
    tutors: tutorsWithRating,
    total,
  };
};

const getATutor = async (id: string) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      description: true,
      price_per_hour: true,
      is_featured: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      bookings: {
        select: {
          id: true,
          date: true,
          status: true,
          rating: {
            select: {
              id: true,
              rating: true,
              review: true,
              createdAt: true,
              booking: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          rating: {
            isNot: null,
          },
        },
      },
    },
  });

  if (!tutorProfile) {
    return null;
  }

  // Extract reviews with student info
  const ratings = tutorProfile.bookings
    .map((booking) => {
      if (booking.rating) {
        return {
          studentName: booking.rating.booking.user.name,
          studentImage: booking.rating.booking.user.image,
          rating: booking.rating.rating,
          review: booking.rating.review,
        };
      }
      return null;
    })
    .filter((review): review is NonNullable<typeof review> => review !== null);

  // Calculate average rating
  const ratingValues = ratings.map((r) => r.rating);
  const averageRating =
    ratingValues.length > 0
      ? ratingValues.reduce((sum, rating) => sum + rating, 0) /
        ratingValues.length
      : 0;

  const { bookings, ...tutorData } = tutorProfile;

  return {
    ...tutorData,
    averageRating: Number(averageRating.toFixed(1)),
    ratings,
  };
};

export const TutorsServices = {
  getAllTutors,
  getATutor,
};
