"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="bottom-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 shrink-0 text-[var(--success)]" />
        ),
        info: (
          <InfoIcon className="size-4 shrink-0 text-[var(--primary)]" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 shrink-0 text-[var(--warning)]" />
        ),
        error: (
          <OctagonXIcon className="size-4 shrink-0 text-[var(--destructive)]" />
        ),
        loading: (
          <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-sm rounded-lg text-xs font-medium py-2 px-3 min-h-0 flex items-center gap-2 border",
          description: "group-[.toast]:text-muted-foreground text-[11px]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs px-2 py-0.5 rounded",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-xs px-2 py-0.5 rounded",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
