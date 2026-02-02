import type { StatusDev } from "@/types"
import { statusLabels } from "@/lib/error-utils"
import { Badge } from "@/components/ui/badge"

const statusStyles: Record<StatusDev, string> = {
  open: "bg-red-100 text-red-700 border border-red-200",
  in_progress: "bg-amber-100 text-amber-700 border border-amber-200",
  fixed: "bg-blue-100 text-blue-700 border border-blue-200",
  wont_fix: "bg-slate-100 text-slate-600 border border-slate-200",
}

export const StatusBadge = ({ status }: { status: StatusDev }) => {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  )
}
