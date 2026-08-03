import express from "express";

import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import attendanceRouter from "./routes/attendance.routes.js";
import reportRouter from "./routes/reports.routes.js";
import leaveRouter from "./routes/leave.routes.js";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import startAbsentReconcileJob from "./jobs/attendanceJobs.js";
import { reconcileAbsentDays } from "./controllers/attendance.controller.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && origin.startsWith("http://localhost:")) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/leaves", leaveRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Attendance Management System API!");
});

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(
    `Attendance Management System API running on http://localhost:${PORT}`,
  );
  await connectDB();

  // Catch up on any absences missed while the server was down, then hand off
  // to the daily cron for ongoing reconciliation.
  try {
    const created = await reconcileAbsentDays(new Date());
    if (created > 0) {
      console.log(`Startup reconcile: auto-marked ${created} absent record(s).`);
    }
  } catch (error) {
    console.error("Startup absent reconcile failed:", error);
  }

  startAbsentReconcileJob();
});
