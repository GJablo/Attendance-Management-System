import Icon from "../ui/Icon";
import { Banner, EmptyState, SectionCard, StatusBadge } from "../ui/Feedback";

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

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function MarkAttendanceCard({ onMarkAttendance, submitting, todayRecord, onLeave }) {
  return (
    <SectionCard
      title="Mark attendance"
      subtitle={new Date().toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}
      action={
        onLeave ? (
          <StatusBadge value="on leave" tone="warning" />
        ) : (
          todayRecord && <StatusBadge value={todayRecord.status} />
        )
      }
    >
      {onLeave ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-sm text-amber-800 dark:text-amber-200">
          <Icon name="calendarCheck" className="mt-0.5 size-4 shrink-0" />
          <p>
            You&apos;re on approved leave today, so attendance is handled for
            you — there&apos;s nothing to mark.
          </p>
        </div>
      ) : todayRecord ? (
        <p className="mb-4 text-sm text-ink-muted">
          You&apos;re already marked{" "}
          <span className="font-semibold text-ink">{todayRecord.status}</span>{" "}
          for today. Marking again updates the record.
        </p>
      ) : (
        <p className="mb-4 text-sm text-ink-muted">
          You haven&apos;t been marked yet today.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={() => onMarkAttendance("present")}
          disabled={submitting || onLeave}
        >
          <Icon name="check" className="size-4" />
          {submitting ? "Working…" : "Mark present"}
        </button>
        <button
          type="button"
          className="btn-danger"
          onClick={() => onMarkAttendance("absent")}
          disabled={submitting || onLeave}
        >
          Mark absent
        </button>
      </div>
    </SectionCard>
  );
}

function LeaveRequestForm({ leaveForm, setLeaveForm, onSubmit, submitting }) {
  const updateField = (field) => (event) =>
    setLeaveForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <SectionCard
      title="Request leave"
      subtitle="Pick your dates and a reason, then submit for approval."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Start date
            <input
              className="field-input"
              type="date"
              value={leaveForm.startDate}
              onChange={updateField("startDate")}
              required
            />
          </label>
          <label className="field-label">
            End date
            <input
              className="field-input"
              type="date"
              value={leaveForm.endDate}
              min={leaveForm.startDate || undefined}
              onChange={updateField("endDate")}
              required
            />
          </label>
        </div>

        <label className="field-label">
          Reason
          <select
            className="field-input"
            value={leaveForm.reason}
            onChange={updateField("reason")}
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
          className="btn-primary self-start"
          disabled={submitting}
        >
          <Icon name="calendarPlus" className="size-4" />
          {submitting ? "Submitting…" : "Submit leave request"}
        </button>
      </form>
    </SectionCard>
  );
}

function AttendanceHistory({ records }) {
  return (
    <SectionCard
      title="Attendance history"
      subtitle={records.length ? `${records.length} records` : undefined}
    >
      {records.length ? (
        <ul className="flex flex-col gap-2">
          {records.map((entry) => (
            <li
              key={entry._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-sunken px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {formatDate(entry.date)}
                </p>
                {entry.remarks && (
                  <p className="mt-0.5 truncate text-sm text-ink-muted">
                    {entry.remarks}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {entry.checkIn && (
                  <span className="hidden items-center gap-1.5 text-xs text-ink-subtle sm:inline-flex">
                    <Icon name="clock" className="size-3.5" />
                    {entry.checkIn}
                  </span>
                )}
                <StatusBadge value={entry.status} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon="calendarCheck">
          No attendance records yet. Mark yourself present to get started.
        </EmptyState>
      )}
    </SectionCard>
  );
}

function LeaveHistory({ entries, onCancelLeave, cancellingLeaveId }) {
  return (
    <SectionCard
      title="Leave status"
      subtitle={entries.length ? `${entries.length} requests` : undefined}
    >
      {entries.length ? (
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => {
            const isPending = entry.status?.toLowerCase() === "pending";
            const isCancelling = cancellingLeaveId === entry._id;

            return (
              <li
                key={entry._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-sunken px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">
                      {entry.reason}
                    </p>
                    <StatusBadge value={entry.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {formatDate(entry.startDate)} → {formatDate(entry.endDate)}
                  </p>
                </div>

                {isPending && (
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => onCancelLeave(entry._id)}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Cancelling…" : "Cancel"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState icon="calendarPlus">No leave requests yet.</EmptyState>
      )}
    </SectionCard>
  );
}

function UserDashboardPage({
  section = "today",
  message,
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
  const todayKey = new Date().toDateString();
  const todayRecord = attendanceRecords.find(
    (entry) => new Date(entry.date).toDateString() === todayKey,
  );

  // On approved leave today when a request is approved and its date range
  // covers now. Mirrors the server-side guard in markAttendance so the UI
  // reflects the same rule the API enforces.
  const now = new Date().getTime();
  const onLeaveToday = leaveHistory.some((entry) => {
    if (entry.status?.toLowerCase() !== "approved") {
      return false;
    }

    const start = new Date(entry.startDate).setHours(0, 0, 0, 0);
    const end = new Date(entry.endDate).setHours(23, 59, 59, 999);
    return start <= now && now <= end;
  });

  const stats = [
    {
      label: "Days present",
      icon: "check",
      value: attendanceRecords.filter(
        (entry) => entry.status?.toLowerCase() === "present",
      ).length,
    },
    {
      label: "Days absent",
      icon: "close",
      value: attendanceRecords.filter(
        (entry) => entry.status?.toLowerCase() === "absent",
      ).length,
    },
    {
      label: "Pending leave",
      icon: "clock",
      value: leaveHistory.filter(
        (entry) => entry.status?.toLowerCase() === "pending",
      ).length,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {message && <Banner>{message}</Banner>}

      {section === "today" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <article key={stat.label} className="section-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-ink-muted">
                    {stat.label}
                  </p>
                  <span className="grid size-8 place-items-center rounded-lg bg-brand-500/12 text-brand-600 dark:text-brand-300">
                    <Icon name={stat.icon} className="size-4" />
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-ink">
                  {stat.value}
                </p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <MarkAttendanceCard
              onMarkAttendance={onMarkAttendance}
              submitting={attendanceSubmitting}
              todayRecord={todayRecord}
              onLeave={onLeaveToday}
            />
            <LeaveRequestForm
              leaveForm={leaveForm}
              setLeaveForm={setLeaveForm}
              onSubmit={onSubmitLeaveRequest}
              submitting={leaveSubmitting}
            />
          </div>
        </>
      )}

      {section === "attendance" && (
        <>
          <MarkAttendanceCard
            onMarkAttendance={onMarkAttendance}
            submitting={attendanceSubmitting}
            todayRecord={todayRecord}
            onLeave={onLeaveToday}
          />
          <AttendanceHistory records={attendanceRecords} />
        </>
      )}

      {section === "leaves" && (
        <>
          <LeaveRequestForm
            leaveForm={leaveForm}
            setLeaveForm={setLeaveForm}
            onSubmit={onSubmitLeaveRequest}
            submitting={leaveSubmitting}
          />
          <LeaveHistory
            entries={leaveHistory}
            onCancelLeave={onCancelLeave}
            cancellingLeaveId={cancellingLeaveId}
          />
        </>
      )}
    </div>
  );
}

export default UserDashboardPage;
