export type Severity = "low" | "medium" | "high" | "critical"

export type StatusDev = "open" | "in_progress" | "fixed" | "wont_fix"

export interface ErrorItem {
  id: string
  errorMessage: string
  context: string
  sourceFile: string
  line: number | null
  column: number | null
  browser: string
  severity: Severity
  statusDev: StatusDev
  assignedDev: string
  fixConfirmedSupport: boolean
  createdAt: string
  updatedAt: string
  notesLink?: string
}

export type ErrorSort = "newest" | "oldest" | "oldest_open_first"

export type ErrorStatusFilter = "all" | StatusDev

export type ErrorSeverityFilter = "all" | Severity

export interface NewErrorInput {
  errorMessage: string
  interpretation: string
  statusDev: StatusDev
  notesLink?: string
}
