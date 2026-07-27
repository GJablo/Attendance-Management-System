import { useState } from "react";
import "./App.css";

const emptyForm = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  phone: "",
  role: "user",
};

function App() {
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

  const submitAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Request failed");
      }

      const currentUser = data.data?.user || null;
      setUser(currentUser);
      setMessage(data.message || "Success");

      if (currentUser?._id) {
        const profileResponse = await fetch(
          `/api/v1/users/${currentUser._id}`,
          {
            credentials: "include",
          },
        );
        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(
            profileData.error || profileData.message || "Profile load failed",
          );
        }

        setProfile(profileData.data);
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
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setProfile(null);
      setMessage("You have been logged out.");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Full-stack management app</p>
          <h1>Attendance Management System</h1>
        </div>
        <div className="chip">React + Express + MongoDB</div>
      </header>

      <main className="content-grid">
        <section className="panel panel-hero">
          <h2>Run your staff and student workflows</h2>
          <p>
            This frontend now connects to the existing authentication and user
            APIs on the backend, so you can sign in, register, and inspect your
            profile from one place.
          </p>

          <div className="stats-grid">
            <article>
              <strong>Auth</strong>
              <span>Login and register</span>
            </article>
            <article>
              <strong>Protected</strong>
              <span>User profile retrieval</span>
            </article>
            <article>
              <strong>Session</strong>
              <span>Cookie-based access</span>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="toggle-row">
            <button
              type="button"
              className={isLogin ? "toggle active" : "toggle"}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={!isLogin ? "toggle active" : "toggle"}
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={submitAuth} className="auth-form">
            {!isLogin && (
              <>
                <div className="field-row">
                  <label>
                    First name
                    <input
                      name="firstname"
                      value={form.firstname}
                      onChange={updateField}
                      required
                    />
                  </label>
                  <label>
                    Last name
                    <input
                      name="lastname"
                      value={form.lastname}
                      onChange={updateField}
                      required
                    />
                  </label>
                </div>

                <label>
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Role
                  <select name="role" value={form.role} onChange={updateField}>
                    <option value="user">User</option>
                    <option value="employee">Employee</option>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              </>
            )}

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                required
              />
            </label>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Working…" : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          {user && (
            <div className="user-card">
              <div>
                <p className="eyebrow">Signed in</p>
                <h3>
                  {user.firstname} {user.lastname}
                </h3>
                <p>{user.email}</p>
              </div>
              <button type="button" className="secondary-btn" onClick={logout}>
                Log out
              </button>
            </div>
          )}

          {profile && (
            <div className="profile-card">
              <h3>Profile details</h3>
              <p>Role: {profile.role}</p>
              <p>Phone: {profile.phone}</p>
              <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
