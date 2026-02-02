import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface ConfirmCheckboxProps {
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export const ConfirmCheckbox = ({
  checked,
  disabled,
  onChange,
  label = "Fix confirmed",
}: ConfirmCheckboxProps) => {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium",
        disabled ? "text-muted-foreground" : "text-foreground"
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
      />
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-md border transition",
          checked
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 bg-white",
          disabled ? "opacity-50" : "hover:border-emerald-400"
        )}
      >
        {checked ? <CheckIcon className="h-3.5 w-3.5" /> : null}
      </span>
    </label>
  )
}
