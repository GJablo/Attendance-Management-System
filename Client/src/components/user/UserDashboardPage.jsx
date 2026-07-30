const LEAVE_REASONS = [
  "Annual",
  "Sick",
  "Maternity",
  "Paternity",
  "Compassionate",
  "Study",
  "Emergency",
  "Unpaid",
];

function UserDashboardPage({
  message,
  onLogout,
  onMarkAttendance,
  attendanceSubmitting,
  leaveForm,
  setLeaveForm,
  onSubmitLeaveRequest,
  leaveSubmitting,
  attendanceRecords,
  leaveHistory,
  onCancelLeave,
  cancellingLeaveId,
}) {
  return (
    <section className="panel dashboard-page-panel user-dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Personal workspace</p>
          <h2>My dashboard</h2>
        </div>
        <button type="button" className="secondary-btn" onClick={onLogout}>
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
                onClick={() => onMarkAttendance("present")}
                disabled={attendanceSubmitting}
              >
                {attendanceSubmitting ? "Working…" : "Mark present"}
              </button>
              <button
                type="button"
                className="action-btn action-btn-danger"
                onClick={() => onMarkAttendance("absent")}
                disabled={attendanceSubmitting}
              >
                Mark absent
              </button>
            </div>
          </div>

          <div className="dashboard-section">
            <h3>Request leave</h3>
            <form onSubmit={onSubmitLeaveRequest} className="auth-form">
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
                  {LEAVE_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="primary-btn"
                disabled={leaveSubmitting}
              >
                {leaveSubmitting ? "Submitting…" : "Submit leave request"}
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
                      <p className="muted">Remarks: {entry.remarks || "—"}</p>
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
                leaveHistory.map((entry) => {
                  const isPending = entry.status?.toLowerCase() === "pending";
                  const isCancelling = cancellingLeaveId === entry._id;

                  return (
                    <div key={entry._id} className="list-card">
                      <div>
                        <strong>{entry.reason}</strong>
                        <p>
                          {new Date(entry.startDate).toLocaleDateString()} -{" "}
                          {new Date(entry.endDate).toLocaleDateString()}
                        </p>
                        <p className="muted">Status: {entry.status}</p>
                      </div>
                      {isPending && (
                        <button
                          type="button"
                          className="action-btn action-btn-danger"
                          onClick={() => onCancelLeave(entry._id)}
                          disabled={isCancelling}
                        >
                          {isCancelling ? "Cancelling…" : "Cancel request"}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No leave requests yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserDashboardPage;
