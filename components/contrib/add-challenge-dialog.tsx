"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { trainingCategories } from "@/config/training"
import { createChallengeType } from "@/lib/supabase/queries"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddChallengeDialog({
  defaultCategory,
  trigger,
}: {
  defaultCategory?: string
  trigger?: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(
    defaultCategory ?? trainingCategories[0].slug
  )
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const created = await createChallengeType({ category, title, description })
      setOpen(false)
      setTitle("")
      setDescription("")
      router.push(`/docs/training/${created.category}/${created.slug}`)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not add the challenge type."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" aria-label="Add challenge type">
            <Plus className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a challenge type</DialogTitle>
          <DialogDescription>
            It appears in the category grid for everyone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ct-category">Category</Label>
            <select
              id="ct-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-input bg-background h-9 rounded-md border px-3 text-sm"
            >
              {trainingCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ct-title">Name</Label>
            <Input
              id="ct-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ret2csu"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ct-desc">Short description</Label>
            <Input
              id="ct-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One line shown under the title"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? "Adding…" : "Add challenge type"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
