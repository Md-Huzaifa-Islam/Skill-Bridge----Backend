import { User } from "better-auth";
interface ModifiedUser extends User {
  role: string;
  is_banned: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: ModifiedUser;
      url?: string;
      token?: string;
    }
  }
}

export {};
