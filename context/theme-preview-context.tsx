"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"

import {
  defaultPresetId,
  isThemePresetId,
  THEME_PREVIEW_CHANNEL,
  type ThemePresetId,
} from "@/lib/theme-presets"

interface ThemePreviewContextType {
  preset: ThemePresetId
  setPreset: (preset: ThemePresetId) => void
}

const ThemePreviewContext = createContext<ThemePreviewContextType | undefined>(
  undefined
)

export function ThemePreviewProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [preset, setPreset] = useState<ThemePresetId>(defaultPresetId)
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    try {
      const channel = new BroadcastChannel(THEME_PREVIEW_CHANNEL)
      channelRef.current = channel
      channel.onmessage = (event: MessageEvent) => {
        const value = (event?.data as { preset?: unknown } | undefined)?.preset
        if (isThemePresetId(value)) setPreset(value)
      }
    } catch {}
    return () => {
      try {
        channelRef.current?.close()
        channelRef.current = null
      } catch {}
    }
  }, [])

  useEffect(() => {
    try {
      channelRef.current?.postMessage({ preset })
    } catch {}
  }, [preset])

  return (
    <ThemePreviewContext.Provider value={{ preset, setPreset }}>
      {children}
    </ThemePreviewContext.Provider>
  )
}

export function useThemePreview() {
  const context = useContext(ThemePreviewContext)
  if (context === undefined) {
    throw new Error(
      "useThemePreview must be used within a ThemePreviewProvider"
    )
  }
  return context
}
