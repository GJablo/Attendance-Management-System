import { useState } from "react";
import { login, register, logout as logoutRequest } from "../api/auth";
import { fetchUserProfile } from "../api/users";

const emptyForm = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  phone: "",
  role: "user",
};

// Owns the login/register form, the signed-in user + profile, and the
// shared `message` banner other hooks also write to.
export const useAuth = ({ navigateTo }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const isLogin = mode === "login";

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;
      const data = isLogin ? await login(payload) : await register(payload);

      const currentUser = data.data?.user || null;
      setUser(currentUser);
      setMessage(data.message || "Success");

      if (currentUser?._id) {
        const profileData = await fetchUserProfile(currentUser._id);
        const nextProfile = profileData.data;
        setProfile(nextProfile);
        navigateTo(nextProfile?.role === "admin" ? "/admin/dashboard" : "/");
      }
    } catch (error) {
      setUser(null);
      setProfile(null);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setProfile(null);
      setMessage("You have been logged out.");
      navigateTo("/");
    }
  };

  return {
    mode,
    isLogin,
    form,
    loading,
    message,
    user,
    profile,
    updateField,
    switchMode,
    submitAuth,
    logout,
    setMessage,
  };
};
