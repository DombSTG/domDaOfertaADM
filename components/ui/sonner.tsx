'use client'

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--bg-elev)",
          "--normal-text": "var(--text)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-sm)",
          "--success-bg": "var(--success-soft)",
          "--success-border": "var(--success)",
          "--success-text": "var(--success)",
          "--error-bg": "var(--danger-soft)",
          "--error-border": "var(--danger)",
          "--error-text": "var(--danger)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
