import { Router } from "express";

const leaveRouter = Router();

leaveRouter.post("/", async (req, res) => {
  res.send({ message: "Post a leave" });
});
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
