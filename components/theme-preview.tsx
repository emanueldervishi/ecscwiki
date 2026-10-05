"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useThemePreview } from "@/context/theme-preview-context"
import { useTheme } from "next-themes"

import {
  defaultPresetId,
  getThemePresetById,
  type ThemePresetId,
} from "@/lib/theme-presets"
import { cn } from "@/lib/utils"
import { ThemeColorPicker } from "@/components/ui/theme-color-picker"

interface ThemePreviewProps {
  children: React.ReactNode
  className?: string
  defaultPreset?: ThemePresetId
  fullScreen?: boolean
  syncUrlTheme?: boolean
  resetOnMount?: boolean
  showColorPicker?: boolean
  withSuspense?: boolean
  suspenseFallback?: React.ReactNode
}

export function ThemePreview({
  children,
  className,
  defaultPreset = defaultPresetId,
  fullScreen = false,
  syncUrlTheme = false,
  resetOnMount = false,
  showColorPicker = true,
  withSuspense = false,
  suspenseFallback,
}: ThemePreviewProps) {
  const { preset, setPreset } = useThemePreview()
  const searchParams = useSearchParams()
  const { setTheme } = useTheme()

  useEffect(() => {
    if (preset === defaultPresetId && defaultPreset !== defaultPresetId) {
      setPreset(defaultPreset)
    }
  }, [defaultPreset, preset, setPreset])

  // Reset to default theme preset on mount when requested
  useEffect(() => {
    if (resetOnMount) {
      setPreset(defaultPresetId)
    }
  }, [resetOnMount, setPreset])

  // Apply theme from URL parameter (?theme=dark|light) when requested
  const themeParam = searchParams?.get("theme")
  useEffect(() => {
    if (syncUrlTheme && (themeParam === "dark" || themeParam === "light")) {
      setTheme(themeParam)
    }
  }, [syncUrlTheme, themeParam, setTheme])

  const activePreset = getThemePresetById(preset)

  const containerClassName = cn(
    fullScreen ? "min-h-screen" : "relative overflow-hidden",
    activePreset?.dataTheme && "bg-background text-foreground",
    !activePreset?.dataTheme && "bg-background",
    "group/preview",
    className
  )
  return (
    <>
      <div
        data-theme={activePreset?.dataTheme || undefined}
        className={containerClassName}
      >
        <div className="pointer-events-none absolute inset-0 border border-transparent [mask:linear-gradient(180deg,white,transparent)]" />
        <div className="preview-iframe-container relative">
          {withSuspense ? (
            <Suspense fallback={suspenseFallback}>{children}</Suspense>
          ) : (
            children
          )}
        </div>
      </div>
      {showColorPicker ? <ThemeColorPicker /> : null}
    </>
  )
}
