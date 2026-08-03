import Icon from "../ui/Icon";
import { StatusBadge } from "../ui/Feedback";

export function Avatar({ user, className = "size-9" }) {
  const initials = `${user?.firstname?.[0] || ""}${user?.lastname?.[0] || ""}`
    .trim()
    .toUpperCase();

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-700 ring-1 ring-brand-500/25 dark:text-brand-200 ${className}`}
    >
      {initials || "?"}
    </span>
  );
}

function UserCard({ user, profile, onLogout }) {
  if (!user) {
    return null;
  }

  const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();

  return (
    <div className="rounded-card border border-line bg-surface-sunken p-3">
      <div className="flex items-center gap-2.5">
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {fullName || "Signed in"}
          </p>
          <p className="truncate text-xs text-ink-subtle">{user.email}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {profile?.role && <StatusBadge value={profile.role} />}
        <button
          type="button"
          onClick={onLogout}
          className="btn-ghost btn-sm"
          title="Log out"
        >
          <Icon name="logout" className="size-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

export default UserCard;
