function LeavesPanel({ leaveRequests, onUpdateStatus, onDeleteLeave }) {
  return (
    <div className="dashboard-section">
      <h4>Manage leave requests</h4>
      <div className="stack-list">
        {leaveRequests.length ? (
          leaveRequests.map((entry) => (
            <div key={entry._id} className="list-card">
              <div>
                <strong>{entry.reason}</strong>
                <p>
                  {new Date(entry.startDate).toLocaleDateString()} -{" "}
                  {new Date(entry.endDate).toLocaleDateString()}
                </p>
                <p className="muted">
                  Requested by: {entry.user?.email || "Unknown user"}
                </p>
                <p className="muted">Status: {entry.status}</p>
              </div>
              <div className="action-row">
                <button
                  type="button"
                  className="action-btn action-btn-success"
                  onClick={() => onUpdateStatus(entry._id, "Approved")}
                >
                  ✓ Approve
                </button>
                <button
                  type="button"
                  className="action-btn action-btn-danger"
                  onClick={() => onUpdateStatus(entry._id, "Rejected")}
                >
                  ✕ Reject
                </button>
                <button
                  type="button"
                  className="action-btn action-btn-danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Delete this leave request permanently? This cannot be undone.",
                      )
                    ) {
                      onDeleteLeave(entry._id);
                    }
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No leave requests found.</p>
        )}
      </div>
    </div>
  );
}

export default LeavesPanel;
