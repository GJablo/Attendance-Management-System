import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", async (req, res) => {
  res.send({ message: "Logout controller" });
});

export default authRouter;
