import { UserRoles } from "../../generated/prisma/enums";

export type registerParams = {
  name: string;
  email: string;
  password: string;
  role: UserRoles;
};

export type loginParams = {
  email: string;
  password: string;
};
