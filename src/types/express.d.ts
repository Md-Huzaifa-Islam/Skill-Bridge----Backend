import { User } from "better-auth";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      url?: string;
      token?: string;
    }
  }
}

export {};
