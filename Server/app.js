import express from "express";

import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Attendance Management System API!");
});

app.listen(PORT, async () => {
  console.log(
    `Attendance Management System API running on http://localhost:${PORT}`,
  );
});
