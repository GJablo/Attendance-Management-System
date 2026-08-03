import { useState } from "react";
import { useRoute } from "./hooks/useRoute";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useAdminData } from "./hooks/useAdminData";
import { useUserDashboardData } from "./hooks/useUserDashboardData";
import AppShell from "./components/shell/AppShell";
import AuthPanel from "./components/auth/AuthPanel";
import AdminDashboardPage from "./components/admin/AdminDashboardPage";
import UserDashboardPage from "./components/user/UserDashboardPage";
import { Spinner } from "./components/ui/Feedback";

const ADMIN_NAV = [
  { key: "overview", label: "Overview", icon: "dashboard" },
  { key: "attendance", label: "Attendance today", icon: "calendarCheck" },
  { key: "users", label: "Users", icon: "users" },
  { key: "leaves", label: "Leave requests", icon: "inbox" },
  { key: "reports", label: "Reports", icon: "fileText" },
];

const USER_NAV = [
  { key: "today", label: "Today", icon: "dashboard" },
  { key: "attendance", label: "My attendance", icon: "calendarCheck" },
  { key: "leaves", label: "My leave", icon: "calendarPlus" },
];

const ADMIN_TITLES = {
  overview: "Executive dashboard",
  attendance: "Attendance today",
  users: "Users",
  leaves: "Leave requests",
  reports: "Reports",
};

const USER_TITLES = {
  today: "My dashboard",
  attendance: "My attendance",
  leaves: "My leave",
};

function App() {
  const { route, navigateTo } = useRoute();
  const { theme, toggleTheme } = useTheme();
  const [userSection, setUserSection] = useState("today");

  const {
    user,
    profile,
    isLogin,
    form,
    loading,
    authLoading,
    message,
    updateField,
    switchMode,
    submitAuth,
    logout,
    setMessage,
  } = useAuth({ navigateTo });

  const isAdmin = profile?.role === "admin";
  const isAdminRoute = route === "/admin/dashboard";
  const isSignedIn = Boolean(user && profile);

  const admin = useAdminData({
    isActive: Boolean(isSignedIn && isAdmin),
    setMessage,
  });

  const userDashboard = useUserDashboardData({
    isActive: Boolean(isSignedIn && !isAdmin),
    userId: profile?._id,
    setMessage,
  });

  const handleLogout = async () => {
    await logout();
    admin.reset();
    userDashboard.reset();
    setUserSection("today");
  };

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <Spinner label="Loading your workspace…" />
      </div>
    );
  }

  // Signed out: full-bleed split sign-in screen, without the shell chrome.
  if (!isSignedIn) {
    return (
      <AuthPanel
        isLogin={isLogin}
        form={form}
        loading={loading}
        message={message}
        theme={theme}
        onToggleTheme={toggleTheme}
        updateField={updateField}
        switchMode={switchMode}
        submitAuth={submitAuth}
      />
    );
  }

  const pendingLeaveCount = admin.leaveRequests.filter(
    (entry) => entry.status?.toLowerCase() === "pending",
  ).length;

  const navItems = isAdmin
    ? ADMIN_NAV.map((item) =>
        item.key === "leaves" ? { ...item, count: pendingLeaveCount } : item,
      )
    : USER_NAV;

  const handleSelectNav = (key) => {
    if (!isAdmin) {
      setUserSection(key);
      return;
    }

    admin.setActivePanel(key);
    if (!isAdminRoute) {
      navigateTo("/admin/dashboard");
    }
  };

  return (
    <AppShell
      navItems={navItems}
      activeKey={isAdmin ? admin.activePanel : userSection}
      onSelectNav={handleSelectNav}
      eyebrow={isAdmin ? "Admin workspace" : "Personal workspace"}
      title={
        isAdmin
          ? ADMIN_TITLES[admin.activePanel] || "Dashboard"
          : USER_TITLES[userSection] || "My dashboard"
      }
      user={user}
      profile={profile}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={handleLogout}
    >
      {isAdmin ? (
        <AdminDashboardPage
          currentUserId={profile?._id}
          message={message}
          dashboard={admin.dashboard}
          dashboardLoading={admin.dashboardLoading}
          monthLoading={admin.monthLoading}
          dashboardError={admin.dashboardError}
          onChangeMonth={admin.changeMonth}
          users={admin.users}
          leaveRequests={admin.leaveRequests}
          todayAttendance={admin.todayAttendance}
          activePanel={admin.activePanel}
          isAdminRoute={isAdminRoute}
          onOpenDashboard={() => navigateTo("/admin/dashboard")}
          onUpdateUserRole={admin.updateUserRole}
          onDeleteUser={admin.deleteUser}
          onUpdateLeaveStatus={admin.updateLeaveStatus}
          onDeleteLeave={admin.deleteLeave}
          onDownloadReports={admin.downloadReports}
        />
      ) : (
        <UserDashboardPage
          section={userSection}
          message={message}
          onMarkAttendance={userDashboard.markAttendance}
          attendanceSubmitting={userDashboard.attendanceSubmitting}
          leaveForm={userDashboard.leaveForm}
          setLeaveForm={userDashboard.setLeaveForm}
          onSubmitLeaveRequest={userDashboard.submitLeaveRequest}
          leaveSubmitting={userDashboard.leaveSubmitting}
          attendanceRecords={userDashboard.attendanceRecords}
          leaveHistory={userDashboard.leaveHistory}
          onCancelLeave={userDashboard.cancelLeaveRequest}
          cancellingLeaveId={userDashboard.cancellingLeaveId}
        />
      )}
    </AppShell>
  );
}

export default App;
