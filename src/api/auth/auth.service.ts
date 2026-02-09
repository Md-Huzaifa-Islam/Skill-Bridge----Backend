import { auth } from "../../lib/auth";
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

const details = async () => {};

export const AuthServices = {
  register,
  login,
  details,
};
