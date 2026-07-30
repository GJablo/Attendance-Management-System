function TopBar({ user, isAdminRoute, onBack, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Full-stack management app</p>
        <h1>Attendance Management System</h1>
      </div>
      {user && (
        <div className="topbar-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={isAdminRoute ? onBack : onLogout}
          >
            {isAdminRoute ? "Back to sign in" : "Log out"}
          </button>
        </div>
      )}
    </header>
  );
}

export default TopBar;
