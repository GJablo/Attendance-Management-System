import { Router } from "express";
import { createLeaveRequest } from "../controllers/leave.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const leaveRouter = Router();

leaveRouter.post("/", authorize, createLeaveRequest);
leaveRouter.get("/", async (req, res) => {
  res.send({ message: "Get employee leaves" });
});
leaveRouter.put("/:id", async (req, res) => {
  res.send({ message: "Update a leave" });
});
leaveRouter.delete("/:id", async (req, res) => {
  res.send({ message: "Delete a leave" });
});

export default leaveRouter;
