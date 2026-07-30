import request from "./client";

// GET /api/v1/attendance is already scoped to "today" server-side.
export const fetchTodayAttendance = () => request("/api/v1/attendance");

export const fetchUserAttendance = (userId) =>
  request(`/api/v1/attendance/user/${userId}`);

export const markAttendance = (payload) =>
  request("/api/v1/attendance/mark", {
    method: "POST",
    body: JSON.stringify(payload),
  });
