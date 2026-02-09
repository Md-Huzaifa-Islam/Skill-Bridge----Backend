import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { ApiRoutes } from "./api/api.route";
import { config } from "./config/config";
import { errorHandler } from "./handlers/errorHandler";
import { appError } from "./types/appError";

const app = express();

// json setup
app.use(express.json());

// cors setup
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// root route
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "This is skill bridge application's backend" });
});

// api route
app.use("/api", ApiRoutes);

// not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Route not found") as appError;
  error.status = 404;
  next(error);
});

// error handler
app.use(errorHandler);

export default app;
