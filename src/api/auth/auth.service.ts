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
  return auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
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
      emailVerified: true,
      createdAt: true,
    },
  });
};

const verifyEmail = async (token: string) => {
  return auth.api.verifyEmail({
    query: {
      token,
    },
    asResponse: true,
  });
};

const logoutUser = async (headers: Headers) => {
  return auth.api.signOut({
    headers,
    asResponse: true,
  });
};

export const AuthServices = {
  register,
  login,
  details,
  verifyEmail,
  logoutUser,
};
