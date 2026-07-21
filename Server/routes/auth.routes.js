import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  res.send({ message: "Creating Account" });
});
authRouter.post("/login", async (req, res) => {
  res.send({ message: "Login controller" });
});
authRouter.post("/logout", async (req, res) => {
  res.send({ message: "Logout controller" });
});

export default authRouter;
