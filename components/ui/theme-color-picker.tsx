"use client"

import { useEffect, useMemo, useState } from "react"
import { useThemePreview } from "@/context/theme-preview-context"

import {
  themeColorMap,
  themePresets,
  type ThemePresetId,
} from "@/lib/theme-presets"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ThemeColorPickerProps {
  className?: string
  containerClassName?: string
}

export function ThemeColorPicker({
  className,
  containerClassName,
}: ThemeColorPickerProps) {
  const { preset, setPreset } = useThemePreview()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const items = useMemo(() => themePresets, [])

  if (!isMounted) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-50 -translate-x-1/2",
        containerClassName
      )}
    >
      <RadioGroup
        aria-label="Theme color"
        value={preset}
        onValueChange={(value) => setPreset(value as ThemePresetId)}
        className={cn(
          "bg-background/80 flex gap-2 rounded-full border p-2 shadow-lg backdrop-blur-sm",
          className
        )}
      >
        {items.map((item) => (
          <label
            key={item.id}
            htmlFor={`theme-${item.id}`}
            className={cn(
              "relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all hover:scale-110",
              preset === item.id
                ? "border-foreground scale-110"
                : "border-muted-foreground/30"
            )}
            style={{ backgroundColor: themeColorMap[item.id] }}
          >
            <RadioGroupItem
              aria-label={item.label}
              value={item.id}
              id={`theme-${item.id}`}
              className="sr-only"
            />
            <span className="sr-only">{item.label}</span>
            {preset === item.id && (
              <div className="bg-background/20 absolute inset-0 rounded-full" />
            )}
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
