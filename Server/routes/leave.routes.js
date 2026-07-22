import { Router } from "express";
import {
  createLeaveRequest,
  getLeaves,
  updateLeave,
} from "../controllers/leave.controller.js";
import authorize, { isAdmin } from "../middlewares/auth.middleware.js";

const leaveRouter = Router();

leaveRouter.post("/", authorize, createLeaveRequest);
leaveRouter.get("/", authorize, isAdmin, getLeaves);
leaveRouter.put("/:id", authorize, isAdmin, updateLeave);
leaveRouter.delete("/:id", async (req, res) => {
  res.send({ message: "Delete a leave" });
});

// cancel leave by requested user

export default leaveRouter;
