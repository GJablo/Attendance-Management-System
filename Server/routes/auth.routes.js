import { Router } from "express";
import {
  login,
  logOut,
  register,
  getMe,
} from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logOut);
authRouter.get("/me", authorize, getMe);

export default authRouter;
