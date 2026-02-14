import { prisma } from "../../lib/prisma";

const details = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      is_banned: true,
      emailVerified: true,
      createdAt: true,
    },
  });
};

export const AuthServices = {
  details,
};
