import { useCallback, useEffect, useMemo, useState } from "react"

import type { ErrorItem, NewErrorInput } from "@/types"
import { createError, deleteError, loadErrors, updateError } from "@/lib/error-service"
import { applyStatusRules, createId, normalizeErrorMessage } from "@/lib/error-utils"

export const useErrors = () => {
  const [errors, setErrors] = useState<ErrorItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setErrors(loadErrors())
    setIsLoaded(true)
  }, [])

  const addError = useCallback(
    (input: NewErrorInput) => {
      const now = new Date().toISOString()
      const normalizedMessage = normalizeErrorMessage(input.errorMessage)

      const newItem: ErrorItem = applyStatusRules({
        id: createId(),
        errorMessage: normalizedMessage,
        context: input.interpretation.trim(),
        sourceFile: "",
        line: null,
        column: null,
        browser: "Chrome",
        severity: "medium",
        statusDev: input.statusDev,
        assignedDev: "",
        fixConfirmedSupport: false,
        createdAt: now,
        updatedAt: now,
        notesLink: input.notesLink?.trim() || undefined,
      })

      setErrors((prev) => createError(newItem, prev))
      return newItem
    },
    []
  )

  const updateErrorItem = useCallback((id: string, updates: Partial<ErrorItem>) => {
    setErrors((prev) => {
      const next = prev.map((item) => {
        if (item.id !== id) return item

        return applyStatusRules({
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
        })
      })

      const updatedItem = next.find((item) => item.id === id)
      if (!updatedItem) return prev
      return updateError(id, updatedItem, prev)
    })
  }, [])

  const deleteErrorItem = useCallback((id: string) => {
    setErrors((prev) => deleteError(id, prev))
  }, [])

  const existingMessages = useMemo(
    () => new Set(errors.map((item) => normalizeErrorMessage(item.errorMessage).toLowerCase())),
    [errors]
  )

  return {
    errors,
    existingMessages,
    isLoaded,
    addError,
    updateError: updateErrorItem,
    deleteError: deleteErrorItem,
  }
}
