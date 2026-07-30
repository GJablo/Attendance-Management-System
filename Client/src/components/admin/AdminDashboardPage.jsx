import AdminSidebar from "./AdminSidebar";
import OverviewPanel from "./OverviewPanel";
import AttendancePanel from "./AttendancePanel";
import UsersPanel from "./UsersPanel";
import LeavesPanel from "./LeavesPanel";
import ReportsPanel from "./ReportsPanel";

function AdminDashboardPage({
  isAdmin,
  currentUserId,
  message,
  dashboard,
  dashboardLoading,
  dashboardError,
  users,
  leaveRequests,
  todayAttendance,
  activePanel,
  setActivePanel,
  onUpdateUserRole,
  onDeleteUser,
  onUpdateLeaveStatus,
  onDownloadReports,
  onBack,
  onLogout,
}) {
  return (
    <main className="dashboard-page">
      <section className="panel dashboard-page-panel">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Admin overview</p>
            <h2>Executive dashboard</h2>
          </div>
          <div className="dashboard-actions">
            <button type="button" className="secondary-btn" onClick={onBack}>
              Back
            </button>
            <button type="button" className="secondary-btn" onClick={onLogout}>
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
            <AdminSidebar
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />

            <div className="dashboard-content">
              {activePanel === "overview" && (
                <OverviewPanel dashboard={dashboard} />
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
                />
              )}

              {activePanel === "reports" && (
                <ReportsPanel onDownload={onDownloadReports} />
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboardPage;
