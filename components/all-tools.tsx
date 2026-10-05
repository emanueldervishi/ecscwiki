import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import {
  trainingCategories,
  trainingResources,
  trainingTools,
  type TrainingLink,
} from "@/config/training"

function Grid({ items }: { items: TrainingLink[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.description}
          className="group text-foreground/90 hover:text-foreground flex items-center gap-1 py-0.5 font-medium underline-offset-4 transition-colors hover:underline"
        >
          {item.name}
          <ArrowUpRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      ))}
    </div>
  )
}

/** Master list of every tool, grouped by category. */
export function AllTools() {
  return (
    <div className="mt-6 flex flex-col gap-10">
      {trainingCategories.map((cat) => {
        const items = trainingTools[cat.slug] ?? []
        if (!items.length) return null
        return (
          <section key={cat.slug}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {cat.label}
              </h2>
              <Link
                href={`/docs/training/${cat.slug}/tools`}
                className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
              >
                View category
              </Link>
            </div>
            <Grid items={items} />
          </section>
        )
      })}
    </div>
  )
}

/** Master list of every learning resource, grouped by category. */
export function AllResources() {
  return (
    <div className="mt-6 flex flex-col gap-10">
      {trainingCategories.map((cat) => {
        const items = trainingResources[cat.slug] ?? []
        if (!items.length) return null
        return (
          <section key={cat.slug}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {cat.label}
              </h2>
              <Link
                href={`/docs/training/${cat.slug}/resources`}
                className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
              >
                View category
              </Link>
            </div>
            <Grid items={items} />
          </section>
        )
      })}
    </div>
  )
}
