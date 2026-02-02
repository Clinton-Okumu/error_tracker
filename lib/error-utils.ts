import type { ErrorItem, ErrorSort, Severity, StatusDev } from "@/types"

export const statusLabels: Record<StatusDev, string> = {
  open: "Open",
  in_progress: "In progress",
  fixed: "Fixed",
  wont_fix: "Won't fix",
}

export const severityLabels: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

export const normalizeErrorMessage = (message: string) => message.trim()

export const applyStatusRules = (item: ErrorItem) => {
  if (item.statusDev !== "fixed" && item.fixConfirmedSupport) {
    return { ...item, fixConfirmedSupport: false }
  }
  return item
}

export const formatRelativeTime = (iso: string) => {
  const date = new Date(iso)
  const now = new Date()
  const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000)
  const absSeconds = Math.abs(diffSeconds)

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  if (absSeconds < 60) {
    return rtf.format(diffSeconds, "second")
  }

  const diffMinutes = Math.round(diffSeconds / 60)
  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, "minute")
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour")
  }

  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, "day")
  }

  const diffWeeks = Math.round(diffDays / 7)
  if (Math.abs(diffWeeks) < 5) {
    return rtf.format(diffWeeks, "week")
  }

  const diffMonths = Math.round(diffDays / 30)
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, "month")
  }

  const diffYears = Math.round(diffDays / 365)
  return rtf.format(diffYears, "year")
}

export const sortErrors = (items: ErrorItem[], sort: ErrorSort) => {
  const data = [...items]

  if (sort === "newest") {
    return data.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  if (sort === "oldest") {
    return data.sort(
      (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    )
  }

  const statusWeight: Record<StatusDev, number> = {
    open: 0,
    in_progress: 1,
    fixed: 2,
    wont_fix: 3,
  }

  return data.sort((a, b) => {
    if (a.statusDev !== b.statusDev) {
      return statusWeight[a.statusDev] - statusWeight[b.statusDev]
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}

export const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`
}
