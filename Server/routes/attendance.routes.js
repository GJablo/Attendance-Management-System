import { Router } from "express";
import { markAttendance } from "../controllers/attendance.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const attendanceRouter = Router();

attendanceRouter.post("/mark", authorize, markAttendance);
attendanceRouter.get("/", async (req, res) => {
  res.send({ message: "Getting attendance" });
});
attendanceRouter.get("/:id", async (req, res) => {
  res.send({ message: "Getting single attendance" });
});
attendanceRouter.put("/:id", async (req, res) => {
  res.send({ message: "Update single attendance" });
});
attendanceRouter.delete("/:id", async (req, res) => {
  res.send({ message: "Delete single attendance" });
});

export default attendanceRouter;
