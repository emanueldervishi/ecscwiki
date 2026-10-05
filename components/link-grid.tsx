import { ArrowUpRight } from "lucide-react"

import {
  type TrainingLink,
  trainingResources,
  trainingTools,
} from "@/config/training"

function LinkGrid({ items }: { items: TrainingLink[] }) {
  if (!items?.length) {
    return (
      <p className="text-muted-foreground mt-6 text-sm">
        Nothing listed yet.
      </p>
    )
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.description}
          className="group text-foreground/90 hover:text-foreground flex items-center gap-1 py-1 text-lg font-medium underline-offset-4 transition-colors hover:underline"
        >
          {item.name}
          <ArrowUpRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      ))}
    </div>
  )
}

export function ToolsGrid({ category }: { category: string }) {
  return <LinkGrid items={trainingTools[category] ?? []} />
}

export function ResourcesGrid({ category }: { category: string }) {
  return <LinkGrid items={trainingResources[category] ?? []} />
}
