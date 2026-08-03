import { SectionCard } from "../ui/Feedback";
import Icon from "../ui/Icon";

const METRICS = [
  { key: "totalEmployees", label: "Total employees", icon: "users" },
  { key: "presentToday", label: "Present today", icon: "check" },
  { key: "absentToday", label: "Absent today", icon: "close" },
  { key: "lateArrivals", label: "Late arrivals", icon: "clock" },
  { key: "pendingLeaveRequests", label: "Pending leave", icon: "inbox" },
  { key: "totalDepartments", label: "Departments", icon: "chart" },
];

const LEGEND = [
  { color: "bg-emerald-500", label: "Present" },
  { color: "bg-rose-500", label: "Absent" },
  { color: "bg-amber-400", label: "Leave" },
];

function MetricCard({ label, value, icon }) {
  return (
    <article className="section-card flex items-center gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500/12 text-brand-600 dark:text-brand-300">
        <Icon name={icon} className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-ink">
          {value ?? "—"}
        </p>
      </div>
    </article>
  );
}

function OverviewPanel({ dashboard }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METRICS.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={dashboard[metric.key]}
            icon={metric.icon}
          />
        ))}
      </div>

      <SectionCard title="Monthly attendance">
        {dashboard.monthlyAttendance?.length ? (
          <ul className="flex flex-col gap-3">
            {dashboard.monthlyAttendance.map((entry) => {
              const total =
                (entry.present || 0) + (entry.absent || 0) + (entry.leave || 0);

              return (
                <li
                  key={entry.day}
                  className="grid grid-cols-[4rem_1fr] items-center gap-3 text-sm sm:grid-cols-[5rem_1fr_4.5rem]"
                >
                  <span className="truncate text-ink-muted">{entry.label}</span>

                  <div
                    className="flex h-2.5 overflow-hidden rounded-full bg-line"
                    aria-hidden="true"
                  >
                    {total > 0 && (
                      <>
                        <div
                          className="bg-emerald-500"
                          style={{ flex: entry.present || 0 }}
                        />
                        <div
                          className="bg-rose-500"
                          style={{ flex: entry.absent || 0 }}
                        />
                        <div
                          className="bg-amber-400"
                          style={{ flex: entry.leave || 0 }}
                        />
                      </>
                    )}
                  </div>

                  <span className="col-start-2 tabular-nums text-ink-muted sm:col-start-3 sm:text-right">
                    {entry.present}/{entry.absent}/{entry.leave}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-ink-muted">
            No attendance records for this month yet.
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4 text-xs text-ink-muted">
          {LEGEND.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${item.color}`} />
              {item.label}
            </span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export default OverviewPanel;
