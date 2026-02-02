"use client"

import * as React from "react"

import type { NewErrorInput, StatusDev } from "@/types"
import { normalizeErrorMessage } from "@/lib/error-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ErrorQuickAddFormProps {
  onCreate: (input: NewErrorInput) => void
  existingMessages: Set<string>
}

const defaultForm: NewErrorInput = {
  errorMessage: "",
  interpretation: "",
  statusDev: "open",
  notesLink: "",
}

export const ErrorQuickAddForm = ({
  onCreate,
  existingMessages,
}: ErrorQuickAddFormProps) => {
  const [form, setForm] = React.useState<NewErrorInput>(defaultForm)
  const [errorMessageError, setErrorMessageError] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  const updateField = (
    key: keyof NewErrorInput,
    value: string | StatusDev
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === "errorMessage") {
      setErrorMessageError(null)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedMessage = normalizeErrorMessage(form.errorMessage)

    if (!normalizedMessage) {
      setErrorMessageError("Error message is required.")
      return
    }

    if (existingMessages.has(normalizedMessage.toLowerCase())) {
      setErrorMessageError("That error message already exists.")
      return
    }

    onCreate({
      ...form,
      errorMessage: normalizedMessage,
      interpretation: form.interpretation.trim(),
      notesLink: form.notesLink?.trim() || undefined,
    })

    setForm(defaultForm)
    setOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/70 px-5 py-4 shadow-sm backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          New Error Entry
        </p>
        <h2 className="text-lg font-semibold text-slate-900">
          Capture incoming issues fast
        </h2>
        <p className="text-sm text-slate-500">
          Open the modal to log a new error and assign a dev.
        </p>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size="sm">New Entry</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-5xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Quick Add Error</AlertDialogTitle>
            <AlertDialogDescription>
              Log a new error, assign an owner, and set the initial status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form id="quick-add-form" className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="error-message">Error</Label>
                  <Input
                    id="error-message"
                    placeholder="TypeError: Cannot read properties of undefined"
                    value={form.errorMessage}
                    onChange={(event) => updateField("errorMessage", event.target.value)}
                    aria-invalid={!!errorMessageError}
                    required
                  />
                  {errorMessageError ? (
                    <p className="text-destructive text-xs">{errorMessageError}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.statusDev}
                    onValueChange={(value) => updateField("statusDev", value as StatusDev)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="wont_fix">Won't fix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interpretation">My interpretation</Label>
                  <Textarea
                    id="interpretation"
                    placeholder="What do we think caused this?"
                    value={form.interpretation}
                    onChange={(event) => updateField("interpretation", event.target.value)}
                    className="min-h-[140px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes-link">Notes Link</Label>
                  <Input
                    id="notes-link"
                    type="url"
                    placeholder="https://ticket/..."
                    value={form.notesLink ?? ""}
                    onChange={(event) => updateField("notesLink", event.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" form="quick-add-form">
              Create Entry
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
