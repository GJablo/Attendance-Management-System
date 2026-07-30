const ROLE_OPTIONS = ["user", "employee", "admin", "teacher", "hr"];

function UsersPanel({ users, onUpdateRole }) {
  return (
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
                onChange={(event) => onUpdateRole(entry._id, event.target.value)}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default UsersPanel;
