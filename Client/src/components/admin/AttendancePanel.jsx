import { useAttendanceBreakdown } from "../../hooks/useAttendanceBreakdown";
import AttendanceColumn from "./AttendanceColumn";
import { SectionCard } from "../ui/Feedback";
import Icon from "../ui/Icon";

const fullName = (user) =>
  `${user?.firstname || "Unknown"} ${user?.lastname || ""}`.trim();

function AttendancePanel({ todayAttendance, leaveRequests, users }) {
  const { presentToday, absentToday, onLeaveToday, unmarkedToday } =
    useAttendanceBreakdown(todayAttendance, leaveRequests, users);

  return (
    <SectionCard
      title="Today's attendance"
      subtitle={new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <AttendanceColumn
          title="Present"
          tone="present"
          items={presentToday}
          emptyIcon="check"
          emptyText="No one has been marked present yet."
          renderItem={(entry) => (
            <>
              <p className="truncate text-sm font-semibold text-ink">
                {fullName(entry.user)}
              </p>
              <p className="truncate text-xs text-ink-muted">
                {entry.user?.email || "No email on file"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-subtle">
                <Icon name="clock" className="size-3.5" />
                Check-in: {entry.checkIn || "—"}
              </p>
            </>
          )}
        />

        <AttendanceColumn
          title="Absent"
          tone="absent"
          items={absentToday}
          emptyIcon="close"
          emptyText="No absences recorded today."
          renderItem={(entry) => (
            <>
              <p className="truncate text-sm font-semibold text-ink">
                {fullName(entry.user)}
              </p>
              <p className="truncate text-xs text-ink-muted">
                {entry.user?.email || "No email on file"}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                Remarks: {entry.remarks || "—"}
              </p>
            </>
          )}
        />

        <AttendanceColumn
          title="On leave"
          tone="leave"
          items={onLeaveToday}
          emptyIcon="calendarPlus"
          emptyText="No one is on approved leave today."
          renderItem={(entry) => (
            <>
              <p className="truncate text-sm font-semibold text-ink">
                {fullName(entry.user)}
              </p>
              <p className="text-xs text-ink-muted">
                {entry.reason} leave until{" "}
                {new Date(entry.endDate).toLocaleDateString()}
              </p>
            </>
          )}
        />
      </div>

      {unmarkedToday.length > 0 && (
        <div className="mt-5 border-t border-dashed border-line pt-4">
          <h4 className="mb-2.5 text-sm font-semibold text-ink">
            Not yet marked ({unmarkedToday.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {unmarkedToday.map((entry) => (
              <span
                key={entry._id}
                className="badge border border-line bg-surface text-ink-muted"
              >
                {entry.firstname} {entry.lastname}
              </span>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

export default AttendancePanel;
