"use client"

import { useCallback, useEffect, useState } from "react"
import { Pencil } from "lucide-react"

import {
  getCurrentUser,
  listContributions,
  upsertAbout,
} from "@/lib/supabase/queries"
import type { Contribution } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { MarkdownField } from "./markdown-field"
import { Markdown } from "./markdown"

const STARTER = `## What it is

Explain in one or two plain sentences what this challenge type is.

## How it occurs

Describe the condition or mistake that makes it possible.

## A quick example

Give a minimal example that shows the idea.

## Fast explanation

The shortest version: what you see, what you do, what you get.
`

/** The single editable About markdown for a challenge. */
export function AboutEditor({
  challenge,
  heading = "About",
}: {
  challenge: string
  heading?: string
}) {
  const [about, setAbout] = useState<Contribution | null>(null)
  const [signedIn, setSignedIn] = useState(false)
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(() => {
    listContributions(challenge, "about").then((rows) =>
      setAbout(rows[0] ?? null)
    )
  }, [challenge])

  useEffect(() => {
    refresh()
    getCurrentUser().then((u) => setSignedIn(!!u))
  }, [refresh])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await upsertAbout({ challengeKey: challenge, body })
      setOpen(false)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.")
    } finally {
      setSaving(false)
    }
  }

  const content = about?.body?.trim() || STARTER

  return (
    <div className="mt-2">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
        {signedIn && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setBody(about?.body ?? STARTER)
              setOpen(true)
            }}
          >
            <Pencil className="mr-1 size-4" />
            Edit
          </Button>
        )}
      </div>

      <Markdown>{content}</Markdown>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit about</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSave} className="flex flex-col gap-4">
            <MarkdownField
              id="about-body"
              label="About (Markdown)"
              value={body}
              onChange={setBody}
              rows={16}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
