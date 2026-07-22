import { Router } from "express";
import {
  getAttendances,
  getUserAttendance,
  markAttendance,
} from "../controllers/attendance.controller.js";
import authorize, { isAdmin } from "../middlewares/auth.middleware.js";

const attendanceRouter = Router();

attendanceRouter.post("/mark", authorize, markAttendance);
attendanceRouter.get("/", authorize, isAdmin, getAttendances);
attendanceRouter.get("/:id", authorize, isAdmin, async (req, res) => {
  res.send({ message: "Getting single attendance" });
});
attendanceRouter.get("/user/:id", authorize, getUserAttendance);
attendanceRouter.put("/:id", async (req, res) => {
  res.send({ message: "Update single attendance" });
});
attendanceRouter.delete("/:id", async (req, res) => {
  res.send({ message: "Delete single attendance" });
});

export default attendanceRouter;
