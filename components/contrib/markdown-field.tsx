"use client"

import { useRef, useState } from "react"
import { Loader2, Paperclip } from "lucide-react"

import { uploadFile } from "@/lib/supabase/queries"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const IMAGE_RE = /\.(png|jpe?g|gif|webp|svg|avif)$/i

export function MarkdownField({
  id,
  label = "Content (Markdown)",
  value,
  onChange,
  rows = 12,
  required,
}: {
  id: string
  label?: string
  value: string
  onChange: (next: string) => void
  rows?: number
  required?: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    setError(null)
    setUploading(true)
    try {
      const snippets: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadFile(file)
        snippets.push(
          IMAGE_RE.test(file.name)
            ? `![${file.name}](${url})`
            : `[${file.name}](${url})`
        )
      }
      const prefix = value && !value.endsWith("\n") ? "\n\n" : ""
      onChange(value + prefix + snippets.join("\n") + "\n")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="mr-1 size-4 animate-spin" />
          ) : (
            <Paperclip className="mr-1 size-4" />
          )}
          Attach file
        </Button>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={onPick}
        />
      </div>
      <Textarea
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="font-mono text-sm"
        placeholder="Write in Markdown. Images and files you attach are inserted here."
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
