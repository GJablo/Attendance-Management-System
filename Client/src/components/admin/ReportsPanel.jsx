import Icon from "../ui/Icon";
import { SectionCard } from "../ui/Feedback";

function ReportsPanel({ onDownload }) {
  return (
    <SectionCard title="Generate reports">
      <p className="mb-5 text-sm text-ink-muted">
        Download attendance reports in CSV format for the current data set.
      </p>
      <button type="button" className="btn-primary" onClick={onDownload}>
        <Icon name="download" className="size-4" />
        Download report
      </button>
    </SectionCard>
  );
}

export default ReportsPanel;
