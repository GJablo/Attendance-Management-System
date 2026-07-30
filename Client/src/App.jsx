import "./App.css";
import { useRoute } from "./hooks/useRoute";
import { useAuth } from "./hooks/useAuth";
import { useAdminData } from "./hooks/useAdminData";
import { useUserDashboardData } from "./hooks/useUserDashboardData";
import TopBar from "./components/TopBar";
import AuthPanel from "./components/auth/AuthPanel";
import AdminDashboardPage from "./components/admin/AdminDashboardPage";
import UserDashboardPage from "./components/user/UserDashboardPage";

function App() {
  const { route, navigateTo } = useRoute();

  const {
    user,
    profile,
    isLogin,
    form,
    loading,
    message,
    updateField,
    switchMode,
    submitAuth,
    logout,
    setMessage,
  } = useAuth({ navigateTo });

  const isAdmin = profile?.role === "admin";
  const isAdminRoute = route === "/admin/dashboard";
  const showUserDashboard = Boolean(
    user && profile && profile.role !== "admin" && route === "/",
  );

  const admin = useAdminData({
    isActive: Boolean(isAdmin && isAdminRoute),
    setMessage,
  });

  const userDashboard = useUserDashboardData({
    isActive: Boolean(profile && profile.role !== "admin" && route === "/"),
    userId: profile?._id,
    setMessage,
  });

  const handleLogout = async () => {
    await logout();
    admin.reset();
    userDashboard.reset();
  };

  return (
    <div className="app-shell">
      <TopBar
        user={user}
        isAdminRoute={isAdminRoute}
        onBack={() => navigateTo("/")}
        onLogout={handleLogout}
      />

      {isAdminRoute ? (
        <AdminDashboardPage
          isAdmin={isAdmin}
          message={message}
          dashboard={admin.dashboard}
          dashboardLoading={admin.dashboardLoading}
          dashboardError={admin.dashboardError}
          users={admin.users}
          leaveRequests={admin.leaveRequests}
          todayAttendance={admin.todayAttendance}
          activePanel={admin.activePanel}
          setActivePanel={admin.setActivePanel}
          onUpdateUserRole={admin.updateUserRole}
          onUpdateLeaveStatus={admin.updateLeaveStatus}
          onDownloadReports={admin.downloadReports}
          onBack={() => navigateTo("/")}
          onLogout={handleLogout}
        />
      ) : (
        <main className="content-grid">
          {showUserDashboard ? (
            <UserDashboardPage
              message={message}
              onLogout={handleLogout}
              onMarkAttendance={userDashboard.markAttendance}
              attendanceSubmitting={userDashboard.attendanceSubmitting}
              leaveForm={userDashboard.leaveForm}
              setLeaveForm={userDashboard.setLeaveForm}
              onSubmitLeaveRequest={userDashboard.submitLeaveRequest}
              leaveSubmitting={userDashboard.leaveSubmitting}
              attendanceRecords={userDashboard.attendanceRecords}
              leaveHistory={userDashboard.leaveHistory}
            />
          ) : (
            <AuthPanel
              isLogin={isLogin}
              form={form}
              loading={loading}
              message={message}
              user={user}
              profile={profile}
              updateField={updateField}
              switchMode={switchMode}
              submitAuth={submitAuth}
              logout={handleLogout}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default App;
