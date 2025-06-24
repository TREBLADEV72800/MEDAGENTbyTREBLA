import * as React from "react"
import { cn } from "../../lib/utils"

const AccessibleInput = React.forwardRef(({ 
  className, 
  type, 
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  error,
  ...props 
}, ref) => {
  const inputId = id || React.useId()
  
  return (
    <input
      id={inputId}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      ref={ref}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-required={ariaRequired}
      aria-invalid={ariaInvalid || !!error}
      {...props}
    />
  );
})
AccessibleInput.displayName = "AccessibleInput"

export { AccessibleInput }