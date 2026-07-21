import { Router } from "express";

const attendanceRouter = Router();

attendanceRouter.post("/mark", async (req, res) => {
  res.send({ message: "Marking attendance" });
});
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
