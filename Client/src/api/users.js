import request from "./client";

export const fetchUserProfile = (userId) => request(`/api/v1/users/${userId}`);

export const fetchUsers = () => request("/api/v1/users");

export const updateUserRole = (userId, role) =>
  request(`/api/v1/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
