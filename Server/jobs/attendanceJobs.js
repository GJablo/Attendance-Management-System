import cron from "node-cron";
import { reconcileAbsentDays } from "../controllers/attendance.controller.js";

// Runs shortly after midnight every day and backfills "absent" records for the
// day that just ended (and, within the reconciler's window, any earlier days
// missed while the server was offline). The on-read reconcile in the admin
// endpoints is the safety net; this is the primary, timely pass.
//
// "5 0 * * *" => 00:05 every day, in the server's local timezone.
export const startAbsentReconcileJob = () => {
  const task = cron.schedule(
    "5 0 * * *",
    async () => {
      try {
        const created = await reconcileAbsentDays(new Date());
        if (created > 0) {
          console.log(`[cron] Auto-marked ${created} absent record(s).`);
        }
      } catch (error) {
        console.error("[cron] Absent reconcile failed:", error);
      }
    },
    { name: "absent-reconcile" },
  );

  return task;
};

export default startAbsentReconcileJob;
