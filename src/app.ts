import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config/config";

const app = express();

// json setup
app.use(express.json());

// cors setup
app.use(
  cors({
    origin: config.app_url,
  }),
);

// root route
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "This is skill bridge application's backend" });
});

export default app;
