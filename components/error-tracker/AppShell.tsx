"use client"

import * as React from "react"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  SearchIcon,
  ShieldCheckIcon,
  TimerIcon,
} from "lucide-react"

import type { ErrorSort, ErrorStatusFilter } from "@/types"
import { sortErrors } from "@/lib/error-utils"
import { useErrors } from "@/hooks/useErrors"
import { ErrorFiltersBar } from "@/components/error-tracker/ErrorFiltersBar"
import { ErrorQuickAddForm } from "@/components/error-tracker/ErrorQuickAddForm"
import { ErrorTable } from "@/components/error-tracker/ErrorTable"
import { Input } from "@/components/ui/input"

export const AppShell = () => {
  const { errors, existingMessages, addError, updateError, deleteError } = useErrors()
  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<ErrorStatusFilter>("all")
  const [sort, setSort] = React.useState<ErrorSort>("newest")

  const filteredErrors = React.useMemo(() => {
    const queryValue = query.trim().toLowerCase()
    let result = [...errors]

    if (queryValue) {
      result = result.filter((item) => {
        const message = item.errorMessage.toLowerCase()
        const context = item.context.toLowerCase()
        return (
          message.includes(queryValue) ||
          context.includes(queryValue)
        )
      })
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.statusDev === statusFilter)
    }

    return sortErrors(result, sort)
  }, [errors, query, statusFilter, sort])

  const stats = React.useMemo(() => {
    const open = errors.filter((item) => item.statusDev === "open").length
    const inProgress = errors.filter((item) => item.statusDev === "in_progress").length
    const fixed = errors.filter((item) => item.statusDev === "fixed").length
    const confirmed = errors.filter((item) => item.fixConfirmedSupport).length

    return {
      open,
      inProgress,
      fixed,
      confirmed,
    }
  }, [errors])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f6f2] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%),radial-gradient(circle_at_85%_20%,_rgba(16,185,129,0.12),_transparent_45%),radial-gradient(circle_at_20%_80%,_rgba(251,191,36,0.12),_transparent_50%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Internal Support Tool
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Error Fix Tracker
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Live updates (local)
            </div>
          </div>
          <div className="relative max-w-xl">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by error or interpretation"
              className="pl-9"
            />
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Open</p>
              <AlertTriangleIcon className="h-4 w-4 text-red-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.open}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">In progress</p>
              <TimerIcon className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.inProgress}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fixed</p>
              <CheckCircle2Icon className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.fixed}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Confirmed</p>
              <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.confirmed}</p>
          </div>
        </section>

        <ErrorQuickAddForm
          onCreate={addError}
          existingMessages={existingMessages}
        />

        <ErrorFiltersBar
          statusFilter={statusFilter}
          sort={sort}
          onStatusChange={setStatusFilter}
          onSortChange={setSort}
        />

        <ErrorTable errors={filteredErrors} onUpdate={updateError} onDelete={deleteError} />
      </div>
    </div>
  )
}
