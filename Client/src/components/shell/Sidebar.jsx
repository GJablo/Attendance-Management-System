import Icon from "../ui/Icon";

function Sidebar({ items = [], activeKey, onSelect, onClose, footer }) {
  return (
    <div className="flex h-full flex-col gap-6 border-r border-line bg-surface px-4 py-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Icon name="clipboard" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-ink">
              Attendance
            </p>
            <p className="truncate text-xs text-ink-subtle">
              Management System
            </p>
          </div>
        </div>

        {/* Only rendered in the mobile drawer. */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost btn-sm lg:hidden"
            aria-label="Close navigation"
          >
            <Icon name="close" className="size-5" />
          </button>
        )}
      </div>

      {items.length > 0 && (
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
          <p className="px-3 pb-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-subtle">
            Admin tools
          </p>
          {items.map((item) => {
            const isActive = item.key === activeKey;

            return (
              <button
                key={item.key}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(item.key)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-600 text-white shadow-soft"
                    : "text-ink-muted hover:bg-surface-sunken hover:text-ink"
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`size-[1.15rem] shrink-0 ${
                    isActive ? "text-white" : "text-ink-subtle"
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.count > 0 && (
                  <span
                    className={`badge ml-auto ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-surface-sunken text-ink-muted ring-1 ring-line"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {footer && <div className="mt-auto">{footer}</div>}
    </div>
  );
}

export default Sidebar;
