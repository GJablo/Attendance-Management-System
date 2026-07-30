const ROLE_OPTIONS = ["user", "employee", "admin", "teacher", "hr"];

function UsersPanel({ users, currentUserId, onUpdateRole, onDeleteUser }) {
  const handleDelete = (entry) => {
    const fullName = `${entry.firstname} ${entry.lastname}`.trim();
    const confirmed = window.confirm(
      `Delete ${fullName || "this user"}? This cannot be undone.`,
    );

    if (confirmed) {
      onDeleteUser(entry._id);
    }
  };

  return (
    <div className="dashboard-section">
      <h4>Manage users</h4>
      <div className="stack-list">
        {users.length ? (
          users.map((entry) => {
            const isSelf = entry._id === currentUserId;

            return (
              <div key={entry._id} className="list-card">
                <div>
                  <strong>
                    {entry.firstname} {entry.lastname}
                  </strong>
                  <p>{entry.email}</p>
                  <p className="muted">Role: {entry.role}</p>
                </div>
                <div className="action-row">
                  <select
                    value={entry.role}
                    onChange={(event) =>
                      onUpdateRole(entry._id, event.target.value)
                    }
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="action-btn action-btn-danger"
                    onClick={() => handleDelete(entry)}
                    disabled={isSelf}
                    title={
                      isSelf ? "You can't delete your own account" : undefined
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default UsersPanel;
