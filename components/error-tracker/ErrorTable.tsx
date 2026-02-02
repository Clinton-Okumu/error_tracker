"use client"

import type { ErrorItem } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorTableRow } from "@/components/error-tracker/ErrorTableRow"

interface ErrorTableProps {
  errors: ErrorItem[]
  onUpdate: (id: string, updates: Partial<ErrorItem>) => void
  onDelete: (id: string) => void
}

export const ErrorTable = ({ errors, onUpdate, onDelete }: ErrorTableProps) => {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Active Errors</CardTitle>
        <p className="text-muted-foreground text-xs">
          {errors.length} total entries
        </p>
      </CardHeader>
      <CardContent className="px-0">
        {errors.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No browser errors yet. Add your first error above.
          </div>
        ) : (
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 bg-white/90 backdrop-blur">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-left font-semibold">Error</th>
                <th className="px-4 py-3 text-left font-semibold">My Interpretation</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((error) => (
                <ErrorTableRow
                  key={error.id}
                  error={error}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
