import { Router } from "express";

const reportRouter = Router();

reportRouter.get("/daily", async (req, res) => {
  res.send({ message: "Getting daily reports" });
});
reportRouter.get("/monthly", async (req, res) => {
  res.send({ message: "Getting monthly reports" });
});
reportRouter.get("/student/:id", async (req, res) => {
  res.send({ message: "Getting reports of single student" });
});
reportRouter.get("/export/pdf", async (req, res) => {
  res.send({ message: "Getting pdf exports" });
});
reportRouter.get("/export/excel", async (req, res) => {
  res.send({ message: "Getting excel exports" });
});

export default reportRouter;
