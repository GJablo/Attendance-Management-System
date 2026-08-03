import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import UserCard from "./UserCard";

// Fixed sidebar + sticky header frame. The sidebar is persistent from `lg` up
// and becomes an overlay drawer below that.
function AppShell({
  navItems,
  activeKey,
  onSelectNav,
  eyebrow,
  title,
  user,
  profile,
  theme,
  onToggleTheme,
  onLogout,
  headerActions,
  children,
}) {
  const [navOpen, setNavOpen] = useState(false);

  // Close the drawer on Escape so it isn't a keyboard trap.
  useEffect(() => {
    if (!navOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navOpen]);

  const sidebar = (
    <Sidebar
      items={navItems}
      activeKey={activeKey}
      onSelect={(key) => {
        onSelectNav(key);
        setNavOpen(false);
      }}
      onClose={navOpen ? () => setNavOpen(false) : undefined}
      footer={<UserCard user={user} profile={profile} onLogout={onLogout} />}
    />
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* Desktop rail */}
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </div>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-lift">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-col">
        <Header
          eyebrow={eyebrow}
          title={title}
          user={user}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenNav={() => setNavOpen(true)}
          showNavButton={navItems?.length > 0}
          actions={headerActions}
        />

        <main className="scroll-area flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
