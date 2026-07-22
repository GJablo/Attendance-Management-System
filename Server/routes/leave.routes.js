import { Router } from "express";
import {
  createLeaveRequest,
  deleteLeave,
  getLeaves,
  updateLeave,
} from "../controllers/leave.controller.js";
import authorize, { isAdmin } from "../middlewares/auth.middleware.js";

const leaveRouter = Router();

leaveRouter.post("/", authorize, createLeaveRequest);
leaveRouter.get("/", authorize, isAdmin, getLeaves);
leaveRouter.put("/:id", authorize, isAdmin, updateLeave);
leaveRouter.delete("/:id", authorize, isAdmin, deleteLeave);

// cancel leave by requested user

export default leaveRouter;
