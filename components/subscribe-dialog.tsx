"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import * as Dialog from "@radix-ui/react-dialog"

const subscribeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .regex(/^\+?[0-9\s\-()]+$/, "Enter a valid phone number"),
})

type SubscribeFormData = z.infer<typeof subscribeSchema>

interface SubscribeDialogProps {
  trigger: React.ReactNode
}

export function SubscribeDialog({ trigger }: SubscribeDialogProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
  })

  const onSubmit = async (data: SubscribeFormData) => {
    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          name: data.name,
          metadata: {
            userAgent: navigator.userAgent,
            locale: navigator.language,
            referrer: document.referrer || undefined,
            source: window.location.pathname,
          },
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to subscribe")
      }

      setStatus("success")
      reset()
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset state when dialog closes
      setTimeout(() => {
        setStatus("idle")
        setErrorMessage("")
        reset()
      }, 200)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyles} />
        <Dialog.Content style={contentStyles}>
          <Dialog.Title style={titleStyles}>subscribe</Dialog.Title>
          <Dialog.Description style={descriptionStyles}>
            get new posts delivered to your whatsapp
          </Dialog.Description>

          {status === "success" ? (
            <div style={successStyles}>
              <p style={{ margin: 0, marginBottom: "8px" }}>✓ subscribed!</p>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--foreground-subtle)" }}>
                you&apos;ll receive new posts on whatsapp
              </p>
              <button onClick={() => setOpen(false)} style={buttonStyles}>
                close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={formStyles}>
              <div style={fieldStyles}>
                <label htmlFor="name" style={labelStyles}>
                  name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="your name"
                  {...register("name")}
                  style={inputStyles}
                  disabled={status === "loading"}
                />
                {errors.name && <span style={errorStyles}>{errors.name.message}</span>}
              </div>

              <div style={fieldStyles}>
                <label htmlFor="phone" style={labelStyles}>
                  whatsapp number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  {...register("phone")}
                  style={inputStyles}
                  disabled={status === "loading"}
                />
                <span style={hintStyles}>include country code (e.g., +1 for US, +44 for UK)</span>
                {errors.phone && <span style={errorStyles}>{errors.phone.message}</span>}
              </div>

              {status === "error" && (
                <div style={errorBoxStyles}>{errorMessage}</div>
              )}

              <button type="submit" style={buttonStyles} disabled={status === "loading"}>
                {status === "loading" ? "subscribing..." : "subscribe"}
              </button>
            </form>
          )}

          <Dialog.Close asChild>
            <button style={closeButtonStyles} aria-label="Close">
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Styles
const overlayStyles: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  animation: "overlayFadeIn 0.2s ease-out",
}

const contentStyles: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "var(--background)",
  border: "1px solid var(--border-color)",
  padding: "28px 32px",
  width: "90vw",
  maxWidth: "360px",
  animation: "dialogFadeIn 0.2s ease-out",
}

const titleStyles: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "14px",
  fontWeight: 400,
  margin: "0 0 4px 0",
  color: "var(--foreground)",
  letterSpacing: "0.05em",
}

const descriptionStyles: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "11px",
  color: "var(--foreground-subtle)",
  margin: "0 0 24px 0",
}

const formStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}

const fieldStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
}

const labelStyles: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "10px",
  color: "var(--foreground-muted)",
  letterSpacing: "0.1em",
  textTransform: "lowercase",
}

const inputStyles: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "13px",
  padding: "10px 12px",
  border: "1px solid var(--border-color)",
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
  outline: "none",
  transition: "border-color 0.2s ease",
}

const hintStyles: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "9px",
  color: "var(--foreground-subtle)",
  marginTop: "2px",
}

const errorStyles: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "10px",
  color: "var(--accent-red)",
}

const errorBoxStyles: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "11px",
  color: "var(--accent-red)",
  padding: "10px 12px",
  border: "1px solid var(--accent-red)",
  backgroundColor: "rgba(139, 77, 77, 0.05)",
}

const buttonStyles: React.CSSProperties = {
  fontFamily: "'Courier New', monospace",
  fontSize: "11px",
  padding: "10px 16px",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  border: "none",
  cursor: "pointer",
  letterSpacing: "0.05em",
  transition: "opacity 0.2s ease",
  marginTop: "8px",
}

const closeButtonStyles: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "12px",
  background: "none",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "var(--foreground-subtle)",
  padding: "4px 8px",
  lineHeight: 1,
}

const successStyles: React.CSSProperties = {
  textAlign: "center",
  padding: "20px 0",
  fontFamily: "'Courier New', monospace",
  fontSize: "13px",
  color: "var(--foreground)",
}

