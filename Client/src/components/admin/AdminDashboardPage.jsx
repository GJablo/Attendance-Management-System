import OverviewPanel from "./OverviewPanel";
import AttendancePanel from "./AttendancePanel";
import UsersPanel from "./UsersPanel";
import LeavesPanel from "./LeavesPanel";
import ReportsPanel from "./ReportsPanel";
import { Banner, Spinner } from "../ui/Feedback";

// Navigation now lives in the app shell's sidebar; this component just renders
// whichever panel is active.
function AdminDashboardPage({
  currentUserId,
  message,
  dashboard,
  dashboardLoading,
  monthLoading,
  dashboardError,
  onChangeMonth,
  users,
  leaveRequests,
  todayAttendance,
  activePanel,
  onUpdateUserRole,
  onDeleteUser,
  onUpdateLeaveStatus,
  onDeleteLeave,
  onDownloadReports,
}) {
  return (
    <div className="flex flex-col gap-5">
      {message && <Banner>{message}</Banner>}
      {dashboardError && <Banner tone="negative">{dashboardError}</Banner>}

      {dashboardLoading && !dashboard && (
        <div className="section-card">
          <Spinner label="Loading dashboard…" />
        </div>
      )}

      {activePanel === "overview" && dashboard && (
        <OverviewPanel
          dashboard={dashboard}
          onChangeMonth={onChangeMonth}
          monthLoading={monthLoading}
        />
      )}

      {activePanel === "attendance" && (
        <AttendancePanel
          todayAttendance={todayAttendance}
          leaveRequests={leaveRequests}
          users={users}
        />
      )}

      {activePanel === "users" && (
        <UsersPanel
          users={users}
          currentUserId={currentUserId}
          onUpdateRole={onUpdateUserRole}
          onDeleteUser={onDeleteUser}
        />
      )}

      {activePanel === "leaves" && (
        <LeavesPanel
          leaveRequests={leaveRequests}
          onUpdateStatus={onUpdateLeaveStatus}
          onDeleteLeave={onDeleteLeave}
        />
      )}

      {activePanel === "reports" && (
        <ReportsPanel onDownload={onDownloadReports} />
      )}
    </div>
  );
}

export default AdminDashboardPage;
