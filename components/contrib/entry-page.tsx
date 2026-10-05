"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Trash2, User } from "lucide-react"

import { getTrainingCategory } from "@/config/training"
import {
  deleteContribution,
  getContribution,
  getCurrentUser,
  listLinkedContributions,
} from "@/lib/supabase/queries"
import type { Contribution } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"

import { Markdown } from "./markdown"

const KIND_LABEL: Record<string, string> = {
  analyze: "Analyze",
  solution: "Solution",
  script: "Scripts",
}

function fmt(date: string) {
  try {
    return new Date(date).toLocaleDateString()
  } catch {
    return ""
  }
}

export function EntryPage({ id }: { id: string }) {
  const [entry, setEntry] = useState<Contribution | null | "loading">("loading")
  const [analysis, setAnalysis] = useState<Contribution | null>(null)
  const [linked, setLinked] = useState<Contribution[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getCurrentUser().then((u) => active && setUserId(u?.id ?? null))
    getContribution(id).then(async (e) => {
      if (!active) return
      setEntry(e)
      if (!e) return
      if (e.linked_id) {
        getContribution(e.linked_id).then((a) => active && setAnalysis(a))
      }
      if (e.kind === "analyze") {
        listLinkedContributions(e.id).then((l) => active && setLinked(l))
      }
    })
    return () => {
      active = false
    }
  }, [id])

  if (entry === "loading") {
    return (
      <div className="relative mx-auto my-6 max-w-[120ch] px-6 lg:my-16">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="relative mx-auto my-6 max-w-[120ch] px-6 lg:my-16">
        <h1 className="text-2xl font-bold">Not found</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This entry does not exist.
        </p>
      </div>
    )
  }

  const [category, slug] = entry.challenge_key.split("/")
  const cat = getTrainingCategory(category)
  const kindBase = `/docs/training/${category}/${slug}/${entry.kind}`

  async function onDelete() {
    if (entry === "loading" || !entry) return
    await deleteContribution(entry.id)
    window.location.href = kindBase
  }

  return (
    <div className="relative mx-auto my-6 max-w-[120ch] px-6 lg:my-16">
      <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-1 text-sm">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          Docs
        </Link>
        <ChevronRightIcon className="h-4 w-4" />
        <Link
          href={`/docs/training/${category}/${slug}`}
          className="hover:text-foreground transition-colors"
        >
          {cat?.label ?? category}
        </Link>
        <ChevronRightIcon className="h-4 w-4" />
        <Link
          href={kindBase}
          className="hover:text-foreground transition-colors"
        >
          {KIND_LABEL[entry.kind] ?? entry.kind}
        </Link>
        <ChevronRightIcon className="h-4 w-4" />
        <span className="text-foreground font-medium">{entry.label}</span>
      </div>

      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        {entry.label}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground flex items-center gap-1 text-sm">
          <User className="size-3.5" />
          {entry.author_name ?? "unknown"} · {fmt(entry.created_at)}
        </span>
        {analysis && (
          <Link
            href={`/docs/training/${category}/${slug}/analyze/${analysis.id}`}
            className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium underline-offset-4 hover:underline"
          >
            ▸ analysis: {analysis.label}
          </Link>
        )}
      </div>

      {entry.kind === "analyze" && linked.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">Connected:</span>
          {linked.map((l) => (
            <Link
              key={l.id}
              href={`/docs/training/${category}/${slug}/${l.kind}/${l.id}`}
              className="border-border rounded-full border px-2.5 py-0.5 text-xs font-medium hover:bg-muted"
            >
              {l.kind}: {l.label}
            </Link>
          ))}
        </div>
      )}

      <div className="pt-8 pb-12">
        <Markdown>{entry.body}</Markdown>
      </div>

      {userId && entry.author === userId && (
        <div className="border-t pt-4">
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="mr-1 size-4" />
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}
