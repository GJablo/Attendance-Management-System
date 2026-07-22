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
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

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
});
