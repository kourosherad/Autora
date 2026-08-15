import type { MaintenanceStatus } from "@/lib/maintenance";
import type { Dictionary } from "@/lib/i18n";

export function StatusBadge({ status, t }: { status: MaintenanceStatus; t: Dictionary }) {
  const label = status === "HEALTHY" ? t.healthy : status === "DUE_SOON" ? t.dueSoon : status === "DUE" ? t.due : t.overdue;
  return <span className={`status status-${status.toLowerCase().replace("_", "-")}`}>{label}</span>;
}

