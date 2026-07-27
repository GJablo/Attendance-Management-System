import { Router } from "express";
import authorize, { isAdmin } from "../middlewares/auth.middleware.js";
import {
  getAdminDashboardSummary,
  getDailyReport,
  getMonthlyReport,
  getStudentReport,
  exportReportAsPdf,
  exportReportAsExcel,
} from "../controllers/reports.controller.js";

const reportRouter = Router();

reportRouter.get(
  "/admin-dashboard",
  authorize,
  isAdmin,
  getAdminDashboardSummary,
);
reportRouter.get("/daily", authorize, isAdmin, getDailyReport);
reportRouter.get("/monthly", authorize, isAdmin, getMonthlyReport);
reportRouter.get("/student/:id", authorize, getStudentReport);
reportRouter.get("/export/pdf", authorize, isAdmin, exportReportAsPdf);
reportRouter.get("/export/excel", authorize, isAdmin, exportReportAsExcel);

export default reportRouter;
