"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PromptInputContextValue {
  value: string
  onValueChange: (value: string) => void
  isLoading: boolean
  onSubmit: () => void
}

const PromptInputContext = React.createContext<PromptInputContextValue | undefined>(undefined)

const usePromptInputContext = () => {
  const context = React.useContext(PromptInputContext)
  if (!context) {
    throw new Error("usePromptInputContext must be used within PromptInput")
  }
  return context
}

interface PromptInputProps extends PromptInputContextValue {
  children: React.ReactNode
  className?: string
}

export const PromptInput = React.forwardRef<
  HTMLDivElement,
  PromptInputProps
>(
  (
    { value, onValueChange, isLoading, onSubmit, children, className },
    ref,
  ) => {
    return (
      <PromptInputContext.Provider value={{ value, onValueChange, isLoading, onSubmit }}>
        <div ref={ref} className={cn("flex flex-col gap-3", className)}>
          {children}
        </div>
      </PromptInputContext.Provider>
    )
  },
)
PromptInput.displayName = "PromptInput"

interface PromptInputTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, placeholder, ...props }, ref) => {
  const { value, onValueChange } = usePromptInputContext()

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "flex min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className,
      )}
      {...props}
    />
  )
})
PromptInputTextarea.displayName = "PromptInputTextarea"

interface PromptInputActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PromptInputActions = React.forwardRef<
  HTMLDivElement,
  PromptInputActionsProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex gap-2", className)}
      {...props}
    />
  )
})
PromptInputActions.displayName = "PromptInputActions"

interface PromptInputActionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tooltip?: string
}

export const PromptInputAction = React.forwardRef<
  HTMLDivElement,
  PromptInputActionProps
>(({ className, tooltip, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      title={tooltip}
      className={cn("flex items-center", className)}
      {...props}
    >
      {children}
    </div>
  )
})
PromptInputAction.displayName = "PromptInputAction"
