function AttendanceColumn({ title, dotClass, badgeClass, items, emptyText, renderItem }) {
  return (
    <div className="attendance-column">
      <div className="attendance-column-header">
        <span className={`status-dot ${dotClass}`} />
        <h5>{title}</h5>
        <span className={`count-badge ${badgeClass}`}>{items.length}</span>
      </div>
      <div className="stack-list attendance-list">
        {items.length ? (
          items.map((entry) => (
            <div key={entry._id} className="list-card attendance-card">
              <div>{renderItem(entry)}</div>
            </div>
          ))
        ) : (
          <p>{emptyText}</p>
        )}
      </div>
    </div>
  );
}

export default AttendanceColumn;
