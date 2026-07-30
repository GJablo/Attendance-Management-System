const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "attendance", label: "Attendance today" },
  { key: "users", label: "Users" },
  { key: "leaves", label: "Leave requests" },
  { key: "reports", label: "Reports" },
];

function AdminSidebar({ activePanel, setActivePanel }) {
  return (
    <aside className="sidebar-card">
      <h3>Admin tools</h3>
      <div className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={
              activePanel === item.key ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setActivePanel(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default AdminSidebar;
