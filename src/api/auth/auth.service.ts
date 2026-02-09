import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { loginParams, registerParams } from "../../types/auth";

const register = async ({ name, email, password, role }: registerParams) => {
  return await auth.api.signUpEmail({
    body: {
      email,
      name,
      password,
      role,
    },
  });
};

const login = async ({ email, password }: loginParams) => {
  return await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
};

const details = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      is_banned: true,
      createdAt: true,
    },
  });
};

export const AuthServices = {
  register,
  login,
  details,
};
