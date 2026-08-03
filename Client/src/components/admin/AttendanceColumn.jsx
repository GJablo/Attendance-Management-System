import Icon from "../ui/Icon";

const TONES = {
  present: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  },
  absent: {
    dot: "bg-rose-500",
    badge: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
  },
  leave: {
    dot: "bg-amber-400",
    badge: "bg-amber-500/14 text-amber-700 dark:text-amber-300",
  },
};

function AttendanceColumn({ title, tone, items, emptyText, emptyIcon, renderItem }) {
  const colors = TONES[tone] || TONES.present;

  return (
    <div className="flex min-w-0 flex-col rounded-card border border-line bg-surface-sunken p-4">
      <header className="mb-3 flex items-center gap-2">
        <span className={`size-2.5 shrink-0 rounded-full ${colors.dot}`} />
        <h3 className="flex-1 truncate text-sm font-semibold text-ink">
          {title}
        </h3>
        <span className={`badge tabular-nums ${colors.badge}`}>
          {items.length}
        </span>
      </header>

      <div className="scroll-area flex max-h-[26rem] flex-col gap-2 overflow-y-auto">
        {items.length ? (
          items.map((entry) => (
            <div
              key={entry._id}
              className="rounded-xl border border-line bg-surface px-3 py-2.5 shadow-soft"
            >
              {renderItem(entry)}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-line px-3 py-6 text-center">
            <Icon
              name={emptyIcon || "inbox"}
              className="size-5 text-ink-subtle"
            />
            <p className="text-xs text-ink-muted">{emptyText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceColumn;
