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

const getInitialRoute = () => {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname || "/";
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
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [activePanel, setActivePanel] = useState("overview");
  const [leaveForm, setLeaveForm] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    reason: "Annual",
  });
  const [attendanceSubmitting, setAttendanceSubmitting] = useState(false);
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [route, setRoute] = useState(getInitialRoute);

  const isLogin = mode === "login";
  const isAdmin = profile?.role === "admin";
  const isAdminRoute = route === "/admin/dashboard";
  const showUserDashboard = Boolean(
    user && profile && profile.role !== "admin" && route === "/",
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const navigateTo = (nextRoute) => {
    const safeRoute = nextRoute || "/";

    if (typeof window !== "undefined") {
      window.history.pushState({}, "", safeRoute);
    }

    setRoute(safeRoute);
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

        const nextProfile = profileData.data;
        setProfile(nextProfile);

        if (nextProfile?.role === "admin") {
          navigateTo("/admin/dashboard");
        } else {
          navigateTo("/");
        }
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
      setAttendanceRecords([]);
      setLeaveHistory([]);
      setMessage("You have been logged out.");
      navigateTo("/");
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

  const loadAdminData = async () => {
    try {
      const [usersResponse, leavesResponse] = await Promise.all([
        fetch("/api/v1/users", { credentials: "include" }),
        fetch("/api/v1/leaves", { credentials: "include" }),
      ]);

      const usersData = await usersResponse.json();
      const leavesData = await leavesResponse.json();

      if (!usersResponse.ok) {
        throw new Error(
          usersData.error || usersData.message || "Users load failed",
        );
      }

      if (!leavesResponse.ok) {
        throw new Error(
          leavesData.error || leavesData.message || "Leaves load failed",
        );
      }

      setUsers(usersData.data || []);
      setLeaveRequests(leavesData.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadUserDashboardData = async () => {
    if (!profile?._id) {
      return;
    }

    try {
      const [attendanceResponse, leavesResponse] = await Promise.all([
        fetch(`/api/v1/attendance/user/${profile._id}`, {
          credentials: "include",
        }),
        fetch("/api/v1/leaves/me", { credentials: "include" }),
      ]);

      const attendanceData = await attendanceResponse.json();
      const leavesData = await leavesResponse.json();

      if (!attendanceResponse.ok) {
        throw new Error(
          attendanceData.error ||
            attendanceData.message ||
            "Attendance load failed",
        );
      }

      if (!leavesResponse.ok) {
        throw new Error(
          leavesData.error || leavesData.message || "Leaves load failed",
        );
      }

      setAttendanceRecords(attendanceData.data || []);
      setLeaveHistory(leavesData.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const markAttendanceRecord = async (status) => {
    setAttendanceSubmitting(true);

    try {
      const response = await fetch("/api/v1/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date: new Date().toISOString(),
          status,
          checkIn: "09:00",
          checkOut: "17:00",
          remarks: `Marked ${status} from dashboard`,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Attendance submission failed",
        );
      }

      setMessage(
        `${status.charAt(0).toUpperCase() + status.slice(1)} marked successfully.`,
      );
      await loadUserDashboardData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setAttendanceSubmitting(false);
    }
  };

  const submitLeaveRequest = async (event) => {
    event.preventDefault();
    setLeaveSubmitting(true);

    try {
      const response = await fetch("/api/v1/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          startDate: leaveForm.startDate,
          endDate: leaveForm.endDate,
          reason: leaveForm.reason,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Leave request failed");
      }

      setLeaveForm({
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        reason: "Annual",
      });
      setMessage("Leave request submitted successfully.");
      await loadUserDashboardData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLeaveSubmitting(false);
    }
  };

  const updateUserRole = async (userId, nextRole) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Role update failed");
      }

      setUsers((current) =>
        current.map((entry) => (entry._id === userId ? data.data : entry)),
      );
      setMessage("User role updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateLeaveStatus = async (leaveId, nextStatus) => {
    try {
      const response = await fetch(`/api/v1/leaves/${leaveId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Leave update failed");
      }

      setLeaveRequests((current) =>
        current.map((entry) => (entry._id === leaveId ? data.data : entry)),
      );
      setMessage(`Leave request ${nextStatus.toLowerCase()} successfully.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const downloadReports = async () => {
    try {
      const response = await fetch("/api/v1/reports/export/excel", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Report download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "attendance-report.csv";
      link.click();
      window.URL.revokeObjectURL(url);
      setMessage("Report downloaded successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handlePopState = () => {
      setRoute(window.location.pathname || "/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!profile?.role) {
      setDashboard(null);
      setDashboardError("");
      return;
    }

    if (profile.role === "admin") {
      if (route === "/admin/dashboard") {
        loadAdminDashboard();
        loadAdminData();
      }
      return;
    }

    if (route === "/") {
      loadUserDashboardData();
    }
  }, [profile?._id, profile?.role, route]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Full-stack management app</p>
          <h1>Attendance Management System</h1>
        </div>
        {user && (
          <div className="topbar-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={isAdminRoute ? () => navigateTo("/") : logout}
            >
              {isAdminRoute ? "Back to sign in" : "Log out"}
            </button>
          </div>
        )}
      </header>

      {isAdminRoute ? (
        <main className="dashboard-page">
          <section className="panel dashboard-page-panel">
            <div className="dashboard-header">
              <div>
                <p className="eyebrow">Admin overview</p>
                <h2>Executive dashboard</h2>
              </div>
              <div className="dashboard-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => navigateTo("/")}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>
            </div>

            {!isAdmin && (
              <div className="message">
                Only admins can access this page. Return to the sign-in screen.
              </div>
            )}

            {isAdmin && dashboardLoading && (
              <p className="message">Loading dashboard…</p>
            )}
            {isAdmin && dashboardError && (
              <p className="message">{dashboardError}</p>
            )}

            {message && isAdmin && <p className="message">{message}</p>}

            {isAdmin && dashboard && (
              <div className="dashboard-layout">
                <aside className="sidebar-card">
                  <h3>Admin tools</h3>
                  <div className="sidebar-nav">
                    <button
                      type="button"
                      className={
                        activePanel === "overview"
                          ? "sidebar-link active"
                          : "sidebar-link"
                      }
                      onClick={() => setActivePanel("overview")}
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      className={
                        activePanel === "users"
                          ? "sidebar-link active"
                          : "sidebar-link"
                      }
                      onClick={() => setActivePanel("users")}
                    >
                      Users
                    </button>
                    <button
                      type="button"
                      className={
                        activePanel === "leaves"
                          ? "sidebar-link active"
                          : "sidebar-link"
                      }
                      onClick={() => setActivePanel("leaves")}
                    >
                      Leave requests
                    </button>
                    <button
                      type="button"
                      className={
                        activePanel === "reports"
                          ? "sidebar-link active"
                          : "sidebar-link"
                      }
                      onClick={() => setActivePanel("reports")}
                    >
                      Reports
                    </button>
                  </div>
                </aside>

                <div className="dashboard-content">
                  {activePanel === "overview" && (
                    <>
                      <div className="stats-grid dashboard-metrics">
                        {[
                          {
                            label: "Total employees",
                            value: dashboard.totalEmployees,
                          },
                          {
                            label: "Present today",
                            value: dashboard.presentToday,
                          },
                          {
                            label: "Absent today",
                            value: dashboard.absentToday,
                          },
                          {
                            label: "Late arrivals",
                            value: dashboard.lateArrivals,
                          },
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

                  {activePanel === "users" && (
                    <div className="dashboard-section">
                      <h4>Manage users</h4>
                      <div className="stack-list">
                        {users.length ? (
                          users.map((entry) => (
                            <div key={entry._id} className="list-card">
                              <div>
                                <strong>
                                  {entry.firstname} {entry.lastname}
                                </strong>
                                <p>{entry.email}</p>
                                <p className="muted">Role: {entry.role}</p>
                              </div>
                              <select
                                value={entry.role}
                                onChange={(event) =>
                                  updateUserRole(entry._id, event.target.value)
                                }
                              >
                                <option value="user">User</option>
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                                <option value="hr">HR</option>
                              </select>
                            </div>
                          ))
                        ) : (
                          <p>No users found.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activePanel === "leaves" && (
                    <div className="dashboard-section">
                      <h4>Manage leave requests</h4>
                      <div className="stack-list">
                        {leaveRequests.length ? (
                          leaveRequests.map((entry) => (
                            <div key={entry._id} className="list-card">
                              <div>
                                <strong>{entry.reason}</strong>
                                <p>
                                  {new Date(
                                    entry.startDate,
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(entry.endDate).toLocaleDateString()}
                                </p>
                                <p className="muted">Status: {entry.status}</p>
                              </div>
                              <div className="action-row">
                                <button
                                  type="button"
                                  className="action-btn action-btn-success"
                                  onClick={() =>
                                    updateLeaveStatus(entry._id, "Approved")
                                  }
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  type="button"
                                  className="action-btn action-btn-danger"
                                  onClick={() =>
                                    updateLeaveStatus(entry._id, "Rejected")
                                  }
                                >
                                  ✕ Reject
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No leave requests found.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activePanel === "reports" && (
                    <div className="dashboard-section">
                      <h4>Generate reports</h4>
                      <p className="muted">
                        Download attendance reports in CSV format for the
                        current data set.
                      </p>
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={downloadReports}
                      >
                        Download report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      ) : (
        <main className="content-grid">
          {showUserDashboard ? (
            <section className="panel dashboard-page-panel user-dashboard-panel">
              <div className="dashboard-header">
                <div>
                  <p className="eyebrow">Personal workspace</p>
                  <h2>My dashboard</h2>
                </div>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>

              {message && <p className="message">{message}</p>}

              <div className="dashboard-layout user-dashboard-layout">
                <div className="dashboard-content">
                  <div className="dashboard-section">
                    <h3>Mark attendance</h3>
                    <div className="action-row">
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() => markAttendanceRecord("present")}
                        disabled={attendanceSubmitting}
                      >
                        {attendanceSubmitting ? "Working…" : "Mark present"}
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn-danger"
                        onClick={() => markAttendanceRecord("absent")}
                        disabled={attendanceSubmitting}
                      >
                        Mark absent
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-section">
                    <h3>Request leave</h3>
                    <form onSubmit={submitLeaveRequest} className="auth-form">
                      <label>
                        Start date
                        <input
                          type="date"
                          value={leaveForm.startDate}
                          onChange={(event) =>
                            setLeaveForm((current) => ({
                              ...current,
                              startDate: event.target.value,
                            }))
                          }
                          required
                        />
                      </label>
                      <label>
                        End date
                        <input
                          type="date"
                          value={leaveForm.endDate}
                          onChange={(event) =>
                            setLeaveForm((current) => ({
                              ...current,
                              endDate: event.target.value,
                            }))
                          }
                          required
                        />
                      </label>
                      <label>
                        Reason
                        <select
                          value={leaveForm.reason}
                          onChange={(event) =>
                            setLeaveForm((current) => ({
                              ...current,
                              reason: event.target.value,
                            }))
                          }
                        >
                          <option value="Annual">Annual</option>
                          <option value="Sick">Sick</option>
                          <option value="Maternity">Maternity</option>
                          <option value="Paternity">Paternity</option>
                          <option value="Compassionate">Compassionate</option>
                          <option value="Study">Study</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Unpaid">Unpaid</option>
                        </select>
                      </label>
                      <button
                        type="submit"
                        className="primary-btn"
                        disabled={leaveSubmitting}
                      >
                        {leaveSubmitting
                          ? "Submitting…"
                          : "Submit leave request"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="dashboard-content">
                  <div className="dashboard-section">
                    <h3>Attendance history</h3>
                    <div className="stack-list">
                      {attendanceRecords.length ? (
                        attendanceRecords.map((entry) => (
                          <div key={entry._id} className="list-card">
                            <div>
                              <strong>
                                {new Date(entry.date).toLocaleDateString()}
                              </strong>
                              <p className="muted">Status: {entry.status}</p>
                              <p className="muted">
                                Remarks: {entry.remarks || "—"}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No attendance records yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="dashboard-section">
                    <h3>Leave status</h3>
                    <div className="stack-list">
                      {leaveHistory.length ? (
                        leaveHistory.map((entry) => (
                          <div key={entry._id} className="list-card">
                            <div>
                              <strong>{entry.reason}</strong>
                              <p>
                                {new Date(entry.startDate).toLocaleDateString()}{" "}
                                - {new Date(entry.endDate).toLocaleDateString()}
                              </p>
                              <p className="muted">Status: {entry.status}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No leave requests yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <>
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
                        <select
                          name="role"
                          value={form.role}
                          onChange={updateField}
                        >
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

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Working…"
                      : isLogin
                        ? "Sign in"
                        : "Create account"}
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
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={logout}
                    >
                      Log out
                    </button>
                  </div>
                )}

                {profile && (
                  <div className="profile-card">
                    <h3>Profile details</h3>
                    <p>Role: {profile.role}</p>
                    <p>Phone: {profile.phone}</p>
                    <p>
                      Joined: {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
