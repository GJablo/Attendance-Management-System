import request from "./client";

export const login = (payload) =>
  request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const register = (payload) =>
  request("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const logout = () => request("/api/v1/auth/logout", { method: "POST" });

export const getMe = () => request("/api/v1/auth/me");
