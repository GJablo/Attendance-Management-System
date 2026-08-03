import Icon from "../ui/Icon";
import { EmptyState, SectionCard, StatusBadge } from "../ui/Feedback";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function LeavesPanel({ leaveRequests, onUpdateStatus, onDeleteLeave }) {
  const handleDelete = (leaveId) => {
    const confirmed = window.confirm(
      "Delete this leave request permanently? This cannot be undone.",
    );

    if (confirmed) {
      onDeleteLeave(leaveId);
    }
  };

  const pending = leaveRequests.filter(
    (entry) => entry.status?.toLowerCase() === "pending",
  ).length;

  return (
    <SectionCard
      title="Manage leave requests"
      subtitle={
        leaveRequests.length
          ? `${leaveRequests.length} total · ${pending} pending`
          : undefined
      }
    >
      {leaveRequests.length ? (
        <ul className="flex flex-col gap-2.5">
          {leaveRequests.map((entry) => (
            <li
              key={entry._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-sunken px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {entry.reason}
                  </p>
                  <StatusBadge value={entry.status} />
                </div>
                <p className="mt-0.5 text-sm text-ink-muted">
                  {formatDate(entry.startDate)} → {formatDate(entry.endDate)}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-subtle">
                  {entry.user?.email || "Unknown user"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-success btn-sm"
                  onClick={() => onUpdateStatus(entry._id, "Approved")}
                >
                  <Icon name="check" className="size-4" />
                  Approve
                </button>
                <button
                  type="button"
                  className="btn-danger btn-sm"
                  onClick={() => onUpdateStatus(entry._id, "Rejected")}
                >
                  <Icon name="close" className="size-4" />
                  Reject
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-sm"
                  onClick={() => handleDelete(entry._id)}
                  aria-label="Delete leave request"
                  title="Delete permanently"
                >
                  <Icon name="trash" className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>No leave requests found.</EmptyState>
      )}
    </SectionCard>
  );
}

export default LeavesPanel;
