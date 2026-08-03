import { useEffect, useState } from "react";
import { login, register, logout as logoutRequest, getMe } from "../api/auth";
import { fetchUserProfile } from "../api/users";

const emptyForm = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  phone: "",
  role: "user",
  // Role-specific: only sent when the chosen role requires them.
  department: "",
  admissionNumber: "",
  class: "",
  guardian: "",
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
  // Starts true so we don't render the login screen before we've had a
  // chance to check whether an existing session cookie is still valid.
  const [authLoading, setAuthLoading] = useState(true);

  const isLogin = mode === "login";

  // On mount (i.e. on every refresh), check the server for an existing
  // valid session instead of assuming the user is logged out just because
  // local React state was reset.
  useEffect(() => {
    let cancelled = false;

    const rehydrate = async () => {
      try {
        const data = await getMe();
        const currentUser = data.data?.user || null;
        if (cancelled || !currentUser) return;

        setUser(currentUser);
        if (currentUser._id) {
          const profileData = await fetchUserProfile(currentUser._id);
          if (!cancelled) setProfile(profileData.data);
        }
      } catch {
        // No valid session cookie (or it expired) - stay logged out.
        if (!cancelled) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };

    rehydrate();
    return () => {
      cancelled = true;
    };
  }, []);

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
    authLoading,
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
