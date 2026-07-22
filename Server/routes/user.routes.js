import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import authorize, { isAdmin } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, isAdmin, getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.put("/:id", authorize, isAdmin, updateUser);
userRouter.delete("/:id", authorize, isAdmin, deleteUser);

export default userRouter;
