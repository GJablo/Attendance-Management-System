function OverviewPanel({ dashboard }) {
  const metrics = [
    { label: "Total employees", value: dashboard.totalEmployees },
    { label: "Present today", value: dashboard.presentToday },
    { label: "Absent today", value: dashboard.absentToday },
    { label: "Late arrivals", value: dashboard.lateArrivals },
    { label: "Pending leave", value: dashboard.pendingLeaveRequests },
    { label: "Departments", value: dashboard.totalDepartments },
  ];

  return (
    <>
      <div className="stats-grid dashboard-metrics">
        {metrics.map((item) => (
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
                  <div className="bar-leave" style={{ flex: entry.leave || 0 }} />
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
  );
}

export default OverviewPanel;
