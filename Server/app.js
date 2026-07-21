import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Attendance Management System API!");
});

app.listen(5500, async () => {
  console.log(
    `Attendance Management System API running on http://localhost:5500`,
  );
});
