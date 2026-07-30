import request from "./client";

export const fetchAdminDashboard = () =>
  request("/api/v1/reports/admin-dashboard");

// Returns a Blob rather than JSON, so it bypasses the shared client.
export const downloadAttendanceReport = async () => {
  const response = await fetch("/api/v1/reports/export/excel", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Report download failed");
  }

  return response.blob();
};
