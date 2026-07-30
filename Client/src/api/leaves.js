import request from "./client";

export const fetchAllLeaves = () => request("/api/v1/leaves");

export const fetchMyLeaves = () => request("/api/v1/leaves/me");

export const createLeave = (payload) =>
  request("/api/v1/leaves", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateLeaveStatus = (leaveId, status) =>
  request(`/api/v1/leaves/${leaveId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const cancelLeave = (leaveId) =>
  request(`/api/v1/leaves/cancel/${leaveId}`, { method: "POST" });

export const deleteLeave = (leaveId) =>
  request(`/api/v1/leaves/${leaveId}`, { method: "DELETE" });
