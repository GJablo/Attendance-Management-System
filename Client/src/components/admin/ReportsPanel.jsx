function ReportsPanel({ onDownload }) {
  return (
    <div className="dashboard-section">
      <h4>Generate reports</h4>
      <p className="muted">
        Download attendance reports in CSV format for the current data set.
      </p>
      <button type="button" className="primary-btn" onClick={onDownload}>
        Download report
      </button>
    </div>
  );
}

export default ReportsPanel;
