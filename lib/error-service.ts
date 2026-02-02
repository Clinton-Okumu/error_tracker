import type { ErrorItem } from "@/types"

const STORAGE_KEY = "error-fix-tracker"

const safeParse = (value: string | null) => {
  if (!value) return [] as ErrorItem[]
  try {
    return JSON.parse(value) as ErrorItem[]
  } catch {
    return [] as ErrorItem[]
  }
}

export const loadErrors = () => {
  if (typeof window === "undefined") return [] as ErrorItem[]
  const raw = safeParse(window.localStorage.getItem(STORAGE_KEY))
  return raw.map((item) => {
    const legacy = item as ErrorItem & {
      errorCode?: string
      description?: string
    }

    return {
      ...item,
      errorMessage: legacy.errorMessage ?? legacy.errorCode ?? "",
      context: legacy.context ?? legacy.description ?? "",
      sourceFile: legacy.sourceFile ?? "",
      line: typeof legacy.line === "number" ? legacy.line : null,
      column: typeof legacy.column === "number" ? legacy.column : null,
      browser: legacy.browser ?? "Chrome",
    }
  })
}

export const saveErrors = (items: ErrorItem[]) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const createError = (item: ErrorItem, current?: ErrorItem[]) => {
  const base = current ?? loadErrors()
  const next = [item, ...base]
  saveErrors(next)
  return next
}

export const updateError = (
  id: string,
  updates: Partial<ErrorItem>,
  current?: ErrorItem[]
) => {
  const base = current ?? loadErrors()
  const next = base.map((item) => (item.id === id ? { ...item, ...updates } : item))
  saveErrors(next)
  return next
}

export const deleteError = (id: string, current?: ErrorItem[]) => {
  const base = current ?? loadErrors()
  const next = base.filter((item) => item.id !== id)
  saveErrors(next)
  return next
}
