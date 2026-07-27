import { useEffect, useState } from "react";
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
  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  const isLogin = mode === "login";
  const isAdmin = profile?.role === "admin";

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
      setDashboard(null);
      setDashboardError("");
      setMessage("You have been logged out.");
    }
  };

  const loadAdminDashboard = async () => {
    setDashboardLoading(true);
    setDashboardError("");

    try {
      const response = await fetch("/api/v1/reports/admin-dashboard", {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Dashboard load failed");
      }

      setDashboard(data.data);
    } catch (error) {
      setDashboard(null);
      setDashboardError(error.message);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (!profile?.role || profile.role !== "admin") {
      setDashboard(null);
      setDashboardError("");
      return;
    }

    loadAdminDashboard();
  }, [profile?._id, profile?.role]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Full-stack management app</p>
          <h1>Attendance Management System</h1>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel panel-hero">
          <h2>Run your staff and student workflows</h2>
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

          {isAdmin && (
            <section className="dashboard-card">
              <div className="dashboard-header">
                <div>
                  <p className="eyebrow">Admin overview</p>
                  <h3>Executive dashboard</h3>
                </div>
                <span className="pill">Live data</span>
              </div>

              {dashboardLoading && (
                <p className="message">Loading dashboard…</p>
              )}
              {dashboardError && <p className="message">{dashboardError}</p>}

              {dashboard && (
                <>
                  <div className="stats-grid dashboard-metrics">
                    {[
                      {
                        label: "Total employees",
                        value: dashboard.totalEmployees,
                      },
                      { label: "Present today", value: dashboard.presentToday },
                      { label: "Absent today", value: dashboard.absentToday },
                      { label: "Late arrivals", value: dashboard.lateArrivals },
                      {
                        label: "Pending leave",
                        value: dashboard.pendingLeaveRequests,
                      },
                      {
                        label: "Departments",
                        value: dashboard.totalDepartments,
                      },
                    ].map((item) => (
                      <article key={item.label} className="metric-card">
                        <span className="metric-value">{item.value}</span>
                        <span className="metric-label">{item.label}</span>
                      </article>
                    ))}
                  </div>

                  <div className="dashboard-section">
                    <h4>Monthly attendance</h4>
                    <div className="chart-list">
                      {dashboard.monthlyAttendance?.length ? (
                        dashboard.monthlyAttendance.map((entry) => (
                          <div key={entry.day} className="bar-row">
                            <span className="bar-label">{entry.label}</span>
                            <div className="bar-track" aria-hidden="true">
                              <div
                                className="bar-present"
                                style={{ flex: entry.present || 0 }}
                              />
                              <div
                                className="bar-absent"
                                style={{ flex: entry.absent || 0 }}
                              />
                              <div
                                className="bar-leave"
                                style={{ flex: entry.leave || 0 }}
                              />
                            </div>
                            <span className="bar-summary">
                              {entry.present}/{entry.absent}/{entry.leave}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p>No attendance records for this month yet.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
