"use client"

import * as React from "react"
import {
  CopyIcon,
  PencilIcon,
  SaveIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import type { ErrorItem, StatusDev } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/error-tracker/StatusBadge"

interface ErrorTableRowProps {
  error: ErrorItem
  onUpdate: (id: string, updates: Partial<ErrorItem>) => void
  onDelete: (id: string) => void
}

export const ErrorTableRow = ({ error, onUpdate, onDelete }: ErrorTableRowProps) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [messageDraft, setMessageDraft] = React.useState(error.errorMessage)
  const [contextDraft, setContextDraft] = React.useState(error.context)
  const [statusDraft, setStatusDraft] = React.useState<StatusDev>(error.statusDev)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    setMessageDraft(error.errorMessage)
    setContextDraft(error.context)
    setStatusDraft(error.statusDev)
  }, [error])

  const handleSave = () => {
    onUpdate(error.id, {
      errorMessage: messageDraft.trim(),
      context: contextDraft.trim(),
      statusDev: statusDraft,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setMessageDraft(error.errorMessage)
    setContextDraft(error.context)
    setStatusDraft(error.statusDev)
    setIsEditing(false)
  }

  const handleEsc = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault()
      handleCancel()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(error.errorMessage)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard write can fail silently in some environments.
    }
  }

  return (
    <tr
      className={cn(
        "border-b border-border/60 text-sm transition hover:bg-slate-50/70",
        error.fixConfirmedSupport ? "bg-emerald-50/70" : "bg-white"
      )}
    >
      <td className="px-4 py-3 align-top">
        {isEditing ? (
          <Input
            value={messageDraft}
            onChange={(event) => setMessageDraft(event.target.value)}
            onKeyDown={handleEsc}
            placeholder="Error message"
          />
        ) : (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-700 hover:text-slate-900"
            title="Click to copy"
          >
            <span className="max-w-[260px] truncate" title={error.errorMessage}>
              {error.errorMessage}
            </span>
            <CopyIcon className="h-3.5 w-3.5 opacity-60" />
            {copied ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Copied
              </span>
            ) : null}
          </button>
        )}
      </td>
      <td className="px-4 py-3 align-top">
        {isEditing ? (
          <Textarea
            value={contextDraft}
            onChange={(event) => setContextDraft(event.target.value)}
            onKeyDown={handleEsc}
            className="min-h-[64px]"
          />
        ) : (
          <p className="max-w-[260px] truncate text-slate-700" title={error.context}>
            {error.context || "—"}
          </p>
        )}
      </td>
      <td className="px-4 py-3 align-top">
        {isEditing ? (
          <Select
            value={statusDraft}
            onValueChange={(value) => setStatusDraft(value as StatusDev)}
          >
            <SelectTrigger className="h-8 w-[150px] border-none bg-transparent px-0 shadow-none">
              <StatusBadge status={statusDraft} />
              <SelectValue className="sr-only" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="wont_fix">Won't fix</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <StatusBadge status={error.statusDev} />
        )}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="xs" onClick={handleSave}>
                <SaveIcon className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button size="xs" variant="ghost" onClick={handleCancel}>
                <XIcon className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="xs" variant="ghost" onClick={() => setIsEditing(true)}>
                <PencilIcon className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                size="xs"
                variant="ghost"
                className="text-destructive"
                onClick={() => onDelete(error.id)}
              >
                <Trash2Icon className="h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
