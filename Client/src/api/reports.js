import request from "./client";

// `month` is 1-based (1 = January) to match the server's query contract. When
// omitted, the server defaults the chart to the current month.
export const fetchAdminDashboard = ({ year, month } = {}) => {
  const params = new URLSearchParams();
  if (year) params.set("year", year);
  if (month) params.set("month", month);

  const query = params.toString();
  return request(
    `/api/v1/reports/admin-dashboard${query ? `?${query}` : ""}`,
  );
};

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
