import { Router } from "express";
import {
  deleteAttendanceById,
  getAttendanceById,
  getAttendances,
  getUserAttendance,
  markAttendance,
  updateAttendanceById,
} from "../controllers/attendance.controller.js";
import authorize, { isAdmin } from "../middlewares/auth.middleware.js";

const attendanceRouter = Router();

attendanceRouter.post("/mark", authorize, markAttendance);
attendanceRouter.get("/", authorize, isAdmin, getAttendances);
attendanceRouter.get("/:id", authorize, isAdmin, getAttendanceById);
attendanceRouter.get("/user/:id", authorize, getUserAttendance);
attendanceRouter.put("/:id", authorize, isAdmin, updateAttendanceById);
attendanceRouter.delete("/:id", authorize, isAdmin, deleteAttendanceById);

export default attendanceRouter;
