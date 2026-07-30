import { useAttendanceBreakdown } from "../../hooks/useAttendanceBreakdown";
import AttendanceColumn from "./AttendanceColumn";

function AttendancePanel({ todayAttendance, leaveRequests, users }) {
  const { presentToday, absentToday, onLeaveToday, unmarkedToday } =
    useAttendanceBreakdown(todayAttendance, leaveRequests, users);

  return (
    <div className="dashboard-section">
      <div className="attendance-summary-row">
        <h4>Today&apos;s attendance</h4>
        <span className="muted">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="attendance-columns">
        <AttendanceColumn
          title="Present"
          dotClass="status-dot-present"
          badgeClass="count-badge-present"
          items={presentToday}
          emptyText="No one has been marked present yet."
          renderItem={(entry) => (
            <>
              <strong>
                {entry.user?.firstname || "Unknown"} {entry.user?.lastname || ""}
              </strong>
              <p className="muted">{entry.user?.email || "No email on file"}</p>
              <p className="muted">Check-in: {entry.checkIn || "—"}</p>
            </>
          )}
        />

        <AttendanceColumn
          title="Absent"
          dotClass="status-dot-absent"
          badgeClass="count-badge-absent"
          items={absentToday}
          emptyText="No absences recorded today."
          renderItem={(entry) => (
            <>
              <strong>
                {entry.user?.firstname || "Unknown"} {entry.user?.lastname || ""}
              </strong>
              <p className="muted">{entry.user?.email || "No email on file"}</p>
              <p className="muted">Remarks: {entry.remarks || "—"}</p>
            </>
          )}
        />

        <AttendanceColumn
          title="On leave"
          dotClass="status-dot-leave"
          badgeClass="count-badge-leave"
          items={onLeaveToday}
          emptyText="No one is on approved leave today."
          renderItem={(entry) => (
            <>
              <strong>
                {entry.user?.firstname || "Unknown"} {entry.user?.lastname || ""}
              </strong>
              <p className="muted">
                {entry.reason} leave until{" "}
                {new Date(entry.endDate).toLocaleDateString()}
              </p>
            </>
          )}
        />
      </div>

      {unmarkedToday.length > 0 && (
        <div className="attendance-unmarked">
          <h5>Not yet marked ({unmarkedToday.length})</h5>
          <div className="chip-row">
            {unmarkedToday.map((entry) => (
              <span key={entry._id} className="chip-outline">
                {entry.firstname} {entry.lastname}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendancePanel;
