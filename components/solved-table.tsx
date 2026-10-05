"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ExternalLinkIcon, Plus } from "lucide-react"

import {
  createSolved,
  getCurrentUser,
  listContributions,
  listSolved,
} from "@/lib/supabase/queries"
import type { Contribution, SolvedEntry } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function WriteupLink({ href }: { href?: string | null }) {
  if (!href) return <span className="text-muted-foreground">—</span>
  const external = href.startsWith("http")
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-foreground inline-flex items-center gap-1 underline underline-offset-4"
    >
      Write-up
      {external && <ExternalLinkIcon className="size-3" />}
    </Link>
  )
}

export function SolvedTable({
  category,
  slug,
}: {
  category: string
  slug: string
}) {
  const challengeKey = `${category}/${slug}`
  const [rows, setRows] = useState<SolvedEntry[]>([])
  const [entries, setEntries] = useState<Contribution[]>([])
  const [signedIn, setSignedIn] = useState(false)
  const [open, setOpen] = useState(false)

  const [name, setName] = useState("")
  const [event, setEvent] = useState("")
  const [year, setYear] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [writeup, setWriteup] = useState("")
  const [linkedId, setLinkedId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(() => {
    listSolved(challengeKey).then(setRows)
  }, [challengeKey])

  useEffect(() => {
    refresh()
    getCurrentUser().then((u) => setSignedIn(!!u))
    listContributions(challengeKey, "analyze").then(setEntries)
  }, [challengeKey, refresh])

  const entryLabel = useMemo(() => {
    const map = new Map(entries.map((e) => [e.id, e.label]))
    return (id: string | null) => (id ? map.get(id) ?? null : null)
  }, [entries])

  const blockedNoAnalysis = entries.length === 0

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await createSolved({
        challengeKey,
        name,
        event,
        year: year ? Number(year) : undefined,
        difficulty,
        writeup,
        linkedId: linkedId || null,
      })
      setOpen(false)
      setName("")
      setEvent("")
      setYear("")
      setDifficulty("")
      setWriteup("")
      setLinkedId("")
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.")
    } finally {
      setSaving(false)
    }
  }

  const cell = "px-4 py-3 text-sm"
  const head = "px-4 py-3 text-left font-mono text-xs font-semibold tracking-tight"

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {rows.length} solved
        </span>
        {signedIn && (
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            disabled={blockedNoAnalysis}
            title={blockedNoAnalysis ? "Add an analysis first" : undefined}
          >
            <Plus className="mr-1 size-4" />
            Add solved challenge
          </Button>
        )}
      </div>

      {blockedNoAnalysis && (
        <div className="border-border bg-muted/30 text-muted-foreground mb-4 rounded-lg border border-dashed p-4 text-sm">
          Create an analysis first — each solved challenge attaches to one.
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border-border bg-muted/30 text-muted-foreground rounded-lg border border-dashed p-6 text-sm">
          No solved challenges recorded yet.
        </div>
      ) : (
        <div className="border-border w-full overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className={head}>Challenge</th>
                <th className={head}>Event</th>
                <th className={head}>Year</th>
                <th className={head}>Difficulty</th>
                <th className={head}>Author</th>
                <th className={head}>Linked</th>
                <th className={head}>Write-up</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn("border-b last:border-b-0", i % 2 && "bg-muted/20")}
                >
                  <td className={cn(cell, "font-medium")}>{row.name}</td>
                  <td className={cell}>{row.event ?? "—"}</td>
                  <td className={cell}>{row.year ?? "—"}</td>
                  <td className={cell}>{row.difficulty ?? "—"}</td>
                  <td className={cell}>{row.author_name ?? "—"}</td>
                  <td className={cell}>{entryLabel(row.linked_id) ?? "—"}</td>
                  <td className={cell}>
                    <WriteupLink href={row.writeup} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a solved challenge</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-name">Challenge name</Label>
              <Input
                id="s-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-event">Event</Label>
                <Input id="s-event" value={event} onChange={(e) => setEvent(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-year">Year</Label>
                <Input id="s-year" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-diff">Difficulty</Label>
              <Input id="s-diff" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="easy / medium / hard" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-writeup">Write-up link</Label>
              <Input id="s-writeup" value={writeup} onChange={(e) => setWriteup(e.target.value)} placeholder="https://… or /docs/…" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-link">Attach to analysis</Label>
              <select
                id="s-link"
                required
                value={linkedId}
                onChange={(e) => setLinkedId(e.target.value)}
                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
              >
                <option value="">Select an analysis…</option>
                {entries.map((en) => (
                  <option key={en.id} value={en.id}>
                    {en.label}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" disabled={saving || !name.trim() || !linkedId}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
