"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  FileCode,
  FlaskConical,
  Info,
  LayoutGrid,
  ListChecks,
  Table,
  Wrench,
} from "lucide-react"

import { getTrainingCategory } from "@/config/training"
import { cn } from "@/lib/utils"

interface Tab {
  key: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

function Bar({
  label,
  items,
  current,
}: {
  label: string
  items: Tab[]
  current: string
}) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-2">
      <nav
        aria-label={`${label} sections`}
        className="bg-background/80 flex max-w-[95vw] items-center gap-1 overflow-x-auto rounded-full border p-1 shadow-lg backdrop-blur-sm"
      >
        <span className="text-muted-foreground shrink-0 px-3 text-xs font-medium max-md:hidden">
          {label}
        </span>
        {items.map((item) => {
          const Icon = item.icon
          const active = current === item.key
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function CategoryNav() {
  const pathname = usePathname()

  const parts = pathname?.split("/").filter(Boolean) ?? []
  const ti = parts.indexOf("training")
  if (ti === -1 || !parts[ti + 1]) return null

  const slug = parts[ti + 1]
  const category = getTrainingCategory(slug)
  if (!category) return null

  const after = parts.slice(ti + 2) // segments after the category
  const categoryBase = `/docs/training/${slug}`

  // Category-level pages: Challenges / Tools / Resources.
  const leaf = after[0]
  if (!leaf || leaf === "tools" || leaf === "resources") {
    const current =
      leaf === "tools" ? "tools" : leaf === "resources" ? "resources" : "overview"
    return (
      <Bar
        label={category.label}
        current={current}
        items={[
          { key: "overview", label: "Challenges", href: categoryBase, icon: LayoutGrid },
          { key: "tools", label: "Tools", href: `${categoryBase}/tools`, icon: Wrench },
          { key: "resources", label: "Resources", href: `${categoryBase}/resources`, icon: BookOpen },
        ]}
      />
    )
  }

  // Challenge-level pages: About / Analyze / Solution / Scripts / Solved.
  const challengeSlug = after[0]
  const sub = after[1] // undefined => About (index)
  const challengeBase = `${categoryBase}/${challengeSlug}`
  const current = sub ?? "about"

  return (
    <Bar
      label={category.label}
      current={current}
      items={[
        { key: "about", label: "About", href: challengeBase, icon: Info },
        { key: "analyze", label: "Analyze", href: `${challengeBase}/analyze`, icon: ListChecks },
        { key: "solution", label: "Solution", href: `${challengeBase}/solution`, icon: FlaskConical },
        { key: "script", label: "Scripts", href: `${challengeBase}/script`, icon: FileCode },
        { key: "solved", label: "Solved", href: `${challengeBase}/solved`, icon: Table },
      ]}
    />
  )
}
