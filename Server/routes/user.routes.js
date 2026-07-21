import { Router } from "express";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  res.send({ message: "getting all users" });
});
userRouter.get("/:id", async (req, res) => {
  res.send({ message: "getting single user by id" });
});
userRouter.post("/", async (req, res) => {
  res.send({ message: "creating user" });
});
userRouter.put("/:id", async (req, res) => {
  res.send({ message: "update single user by id" });
});
userRouter.delete("/:id", async (req, res) => {
  res.send({ message: "deleting single user by id" });
});

export default userRouter;
