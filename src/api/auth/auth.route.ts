import { Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { auth as middewareAuth } from "../../middleware/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../lib/auth";
import { sanitizeRegister } from "../../middleware/sanitizeRegister";

const router = Router();

router.post(
  "/register",
  sanitizeRegister,
  async (req: Request, res: Response) => {
    const handler = toNodeHandler(auth);

    req.url = "/sign-up/email";

    return handler(req, res);
  },
);

router.post("/login", async (req: Request, res: Response) => {
  const handler = toNodeHandler(auth);

  req.url = "/sign-in/email";

  return handler(req, res);
});

// details route
router.get(
  "/me",
  middewareAuth(UserRoles.admin, UserRoles.student, UserRoles.teacher),
  AuthControllers.details,
);

// verify route
router.get("/verify", async (req: Request, res: Response) => {
  const handler = toNodeHandler(auth);

  req.url =
    "/verify-email" +
    (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "");

  return handler(req, res);
});

router.post("/logout", async (req: Request, res: Response) => {
  const handler = toNodeHandler(auth);

  req.url = "/sign-out";

  return handler(req, res);
});

router.all("/*splat", toNodeHandler(auth));

export { router as AuthRoutes };
