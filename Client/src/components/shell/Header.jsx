import Icon from "../ui/Icon";
import { Avatar } from "./UserCard";

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="btn-secondary btn-sm"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Icon name={isDark ? "sun" : "moon"} className="size-4" />
    </button>
  );
}

function Header({
  eyebrow,
  title,
  user,
  theme,
  onToggleTheme,
  onOpenNav,
  showNavButton,
  actions,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        {showNavButton && (
          <button
            type="button"
            onClick={onOpenNav}
            className="btn-secondary btn-sm lg:hidden"
            aria-label="Open navigation"
          >
            <Icon name="menu" className="size-5" />
          </button>
        )}

        <div className="min-w-0 flex-1">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="truncate text-lg font-bold tracking-tight text-ink sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {user && (
            <span className="hidden items-center gap-2 rounded-full border border-line bg-surface-sunken py-1 pl-1 pr-3 sm:inline-flex">
              <Avatar user={user} className="size-7 text-xs" />
              <span className="max-w-[10rem] truncate text-sm font-medium text-ink">
                {user.firstname} {user.lastname}
              </span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
