import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.controller.js";
import authorize, { isAdmin } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, isAdmin, getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.put("/:id", authorize, isAdmin, async (req, res) => {
  res.send({ message: "update single user by id" });
});
userRouter.delete("/:id", authorize, isAdmin, deleteUser);

export default userRouter;
