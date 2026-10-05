"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Plus, User } from "lucide-react"

import {
  createContribution,
  getCurrentUser,
  listContributions,
} from "@/lib/supabase/queries"
import type { Contribution, ContributionKind } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { MarkdownField } from "./markdown-field"

type Kind = Exclude<ContributionKind, "about">

const COPY: Record<Kind, { noun: string; add: string }> = {
  analyze: { noun: "analysis", add: "Add your analysis" },
  solution: { noun: "solution", add: "Add a solution" },
  script: { noun: "script", add: "Add a script" },
}

function fmt(date: string) {
  try {
    return new Date(date).toLocaleDateString()
  } catch {
    return ""
  }
}

export function ContributionSection({
  challenge,
  kind,
  category,
  slug,
}: {
  challenge: string
  kind: Kind
  category: string
  slug: string
}) {
  const [items, setItems] = useState<Contribution[]>([])
  const [analyses, setAnalyses] = useState<Contribution[]>([])
  const [signedIn, setSignedIn] = useState(false)
  const [open, setOpen] = useState(false)

  const [label, setLabel] = useState("")
  const [body, setBody] = useState("")
  const [linkedId, setLinkedId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const needsLink = kind !== "analyze"

  const refresh = useCallback(() => {
    listContributions(challenge, kind).then(setItems)
    if (needsLink) {
      listContributions(challenge, "analyze").then(setAnalyses)
    }
  }, [challenge, kind, needsLink])

  useEffect(() => {
    refresh()
    getCurrentUser().then((u) => setSignedIn(!!u))
  }, [refresh])

  const analysisLabel = useMemo(() => {
    const map = new Map(analyses.map((a) => [a.id, a.label]))
    return (id: string | null) => (id ? map.get(id) ?? null : null)
  }, [analyses])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await createContribution({
        challengeKey: challenge,
        kind,
        label,
        body,
        linkedId: needsLink ? linkedId : null,
      })
      setOpen(false)
      setLabel("")
      setBody("")
      setLinkedId("")
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.")
    } finally {
      setSaving(false)
    }
  }

  const copy = COPY[kind]
  const base = `/docs/training/${category}/${slug}/${kind}`
  const blockedNoAnalysis = needsLink && analyses.length === 0

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {items.length} {items.length === 1 ? "entry" : "entries"}
        </span>
        {signedIn && (
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            disabled={blockedNoAnalysis}
            title={
              blockedNoAnalysis
                ? "Add an analysis first"
                : undefined
            }
          >
            <Plus className="mr-1 size-4" />
            {copy.add}
          </Button>
        )}
      </div>

      {blockedNoAnalysis && (
        <div className="border-border bg-muted/30 text-muted-foreground mb-4 rounded-lg border border-dashed p-4 text-sm">
          Create an{" "}
          <Link
            href={`/docs/training/${category}/${slug}/analyze`}
            className="text-foreground underline underline-offset-4"
          >
            analysis
          </Link>{" "}
          first — every {copy.noun} attaches to one.
        </div>
      )}

      {items.length === 0 ? (
        <div className="border-border bg-muted/30 text-muted-foreground rounded-lg border border-dashed p-6 text-sm">
          No {copy.noun} entries yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`${base}/${item.id}`}
              className="border-border hover:bg-muted/40 flex flex-col gap-2 rounded-lg border p-4 transition-colors"
            >
              <span className="font-medium">{item.label || "Untitled"}</span>
              {needsLink && analysisLabel(item.linked_id) && (
                <span className="bg-primary/10 text-primary w-fit rounded-full px-2 py-0.5 text-xs font-medium">
                  ▸ {analysisLabel(item.linked_id)}
                </span>
              )}
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <User className="size-3" />
                {item.author_name ?? "unknown"} · {fmt(item.created_at)}
              </span>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{copy.add}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {needsLink && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="c-link">Attach to analysis</Label>
                <select
                  id="c-link"
                  required
                  value={linkedId}
                  onChange={(e) => setLinkedId(e.target.value)}
                  className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                >
                  <option value="">Select an analysis…</option>
                  {analyses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="c-label">Title</Label>
              <Input
                id="c-label"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="A short label for your entry"
              />
            </div>
            <MarkdownField
              id="c-body"
              value={body}
              onChange={setBody}
              rows={12}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={saving || !label.trim() || (needsLink && !linkedId)}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
