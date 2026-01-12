"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(143, 85%, 96%)",
          "--success-text": "hsl(140, 100%, 27%)",
          "--success-border": "hsl(145, 92%, 91%)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          success: 'text-green-600',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
