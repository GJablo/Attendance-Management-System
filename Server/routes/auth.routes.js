import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", async (req, res) => {
  res.send({ message: "Login controller" });
});
authRouter.post("/logout", async (req, res) => {
  res.send({ message: "Logout controller" });
});

export default authRouter;
