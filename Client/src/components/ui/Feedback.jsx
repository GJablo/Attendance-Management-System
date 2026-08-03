import Icon from "./Icon";

// Maps the free-text status/role strings the API returns onto a fixed set of
// tone classes, so every badge in the app is colored the same way.
const TONES = {
  positive:
    "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20",
  negative:
    "bg-rose-500/12 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20",
  warning:
    "bg-amber-500/14 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/25",
  brand: "bg-brand-500/12 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/20",
  neutral: "bg-surface-sunken text-ink-muted ring-1 ring-line",
};

const STATUS_TONES = {
  present: "positive",
  approved: "positive",
  active: "positive",
  absent: "negative",
  rejected: "negative",
  cancelled: "neutral",
  canceled: "neutral",
  pending: "warning",
  late: "warning",
  leave: "warning",
  admin: "brand",
};

export function toneForStatus(value) {
  return STATUS_TONES[String(value || "").toLowerCase()] || "neutral";
}

export function StatusBadge({ value, tone, className = "" }) {
  const resolved = tone || toneForStatus(value);

  return (
    <span className={`badge capitalize ${TONES[resolved]} ${className}`}>
      {value}
    </span>
  );
}

export function Banner({ children, tone = "brand" }) {
  if (!children) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-2.5 rounded-card px-4 py-3 text-sm font-medium ${TONES[tone]}`}
    >
      <Icon name="info" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function EmptyState({ icon = "inbox", children }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-line px-4 py-8 text-center">
      <Icon name={icon} className="size-6 text-ink-subtle" />
      <p className="text-sm text-ink-muted">{children}</p>
    </div>
  );
}

export function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`section-card ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-semibold tracking-tight text-ink">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Spinner({ label = "Loading" }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
      <span
        className="size-4 animate-spin rounded-full border-2 border-line border-t-brand-600"
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
