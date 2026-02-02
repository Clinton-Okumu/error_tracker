"use client"

import type { ErrorSort, ErrorStatusFilter } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ErrorFiltersBarProps {
  statusFilter: ErrorStatusFilter
  sort: ErrorSort
  onStatusChange: (value: ErrorStatusFilter) => void
  onSortChange: (value: ErrorSort) => void
}

export const ErrorFiltersBar = ({
  statusFilter,
  sort,
  onStatusChange,
  onSortChange,
}: ErrorFiltersBarProps) => {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="grid gap-3 py-3 md:grid-cols-[1fr_1fr]">
        <div className="space-y-1.5">
          <Label htmlFor="status-filter" className="text-[11px] uppercase tracking-wide text-slate-500">
            Status
          </Label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="wont_fix">Won't fix</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sort-filter" className="text-[11px] uppercase tracking-wide text-slate-500">
            Sort
          </Label>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger id="sort-filter">
              <SelectValue placeholder="Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="oldest_open_first">Oldest open first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
