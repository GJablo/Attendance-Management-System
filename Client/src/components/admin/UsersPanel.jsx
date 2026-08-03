import Icon from "../ui/Icon";
import { EmptyState, SectionCard, StatusBadge } from "../ui/Feedback";
import { Avatar } from "../shell/UserCard";

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
    <SectionCard
      title="Manage users"
      subtitle={users.length ? `${users.length} accounts` : undefined}
    >
      {users.length ? (
        <ul className="flex flex-col gap-2.5">
          {users.map((entry) => {
            const isSelf = entry._id === currentUserId;

            return (
              <li
                key={entry._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-sunken px-4 py-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar user={entry} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-ink">
                        {entry.firstname} {entry.lastname}
                      </p>
                      {isSelf && (
                        <StatusBadge value="you" tone="brand" />
                      )}
                    </div>
                    <p className="truncate text-sm text-ink-muted">
                      {entry.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`role-${entry._id}`}>
                    Role for {entry.firstname} {entry.lastname}
                  </label>
                  <select
                    id={`role-${entry._id}`}
                    className="field-input w-auto py-1.5 text-[0.8125rem] capitalize"
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
                    className="btn-danger btn-sm"
                    onClick={() => handleDelete(entry)}
                    disabled={isSelf}
                    aria-label={`Delete ${entry.firstname} ${entry.lastname}`}
                    title={
                      isSelf ? "You can't delete your own account" : "Delete user"
                    }
                  >
                    <Icon name="trash" className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState icon="users">No users found.</EmptyState>
      )}
    </SectionCard>
  );
}

export default UsersPanel;
