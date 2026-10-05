export type ThemePresetId =
  | "default"
  | "red"
  | "orange"
  | "blue"
  | "green"
  | "yellow"

export interface ThemePreset {
  id: ThemePresetId
  label: string
  description?: string
  dataTheme?: Exclude<ThemePresetId, "default">
}

export const themePresets: ThemePreset[] = [
  {
    id: "default",
    label: "ECSC Albania",
    description: "Project default system colors.",
  },
  {
    id: "red",
    label: "Red",
    description: "Bold red accents with warm neutrals.",
    dataTheme: "red",
  },
  {
    id: "orange",
    label: "Orange",
    description: "Energetic orange theme with vibrant highlights.",
    dataTheme: "orange",
  },
  {
    id: "blue",
    label: "Blue",
    description: "Classic blue palette with cool undertones.",
    dataTheme: "blue",
  },
  {
    id: "green",
    label: "Green",
    description: "Fresh green theme inspired by nature.",
    dataTheme: "green",
  },
  {
    id: "yellow",
    label: "Yellow",
    description: "Bright yellow theme with high contrast.",
    dataTheme: "yellow",
  },
]

// BroadcastChannel name used for theme preview sync
export const THEME_PREVIEW_CHANNEL = "theme-preview" as const

// Default preset id
export const defaultPresetId: ThemePresetId = "default"

const themePresetIdSet: ReadonlySet<ThemePresetId> = new Set(
  themePresets.map((p) => p.id) as ThemePresetId[]
)

export function isThemePresetId(value: unknown): value is ThemePresetId {
  return (
    typeof value === "string" && themePresetIdSet.has(value as ThemePresetId)
  )
}

// Centralized color mapping for presets (used by the picker UI)
export const themeColorMap: Record<ThemePresetId, string> = {
  default: "hsl(var(--primary))",
  red: "hsl(0 84% 60%)",
  orange: "hsl(25 95% 53%)",
  blue: "hsl(221 83% 53%)",
  green: "hsl(142 76% 36%)",
  yellow: "hsl(48 96% 53%)",
}

export function getThemePresetById(id: ThemePresetId) {
  return themePresets.find((p) => p.id === id)
}
