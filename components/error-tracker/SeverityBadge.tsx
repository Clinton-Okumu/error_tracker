import type { Severity } from "@/types"
import { severityLabels } from "@/lib/error-utils"
import { Badge } from "@/components/ui/badge"

const severityStyles: Record<Severity, string> = {
  low: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border border-amber-200",
  high: "bg-orange-100 text-orange-700 border border-orange-200",
  critical: "bg-red-100 text-red-700 border border-red-200",
}

export const SeverityBadge = ({ severity }: { severity: Severity }) => {
  return (
    <Badge variant="outline" className={severityStyles[severity]}>
      {severityLabels[severity]}
    </Badge>
  )
}
