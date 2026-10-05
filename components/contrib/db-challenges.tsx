"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { listDbChallengeTypes } from "@/lib/supabase/queries"
import type { DbChallengeType } from "@/lib/supabase/types"

/** Appends team-added challenge types to a category grid. Renders nothing when empty. */
export function DbChallenges({ category }: { category: string }) {
  const [items, setItems] = useState<DbChallengeType[]>([])

  useEffect(() => {
    let active = true
    listDbChallengeTypes(category).then((rows) => {
      if (active) setItems(rows)
    })
    return () => {
      active = false
    }
  }, [category])

  if (!items.length) return null

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/docs/training/${item.category}/${item.slug}`}
          title={item.description}
          className="text-foreground/90 hover:text-foreground py-1 text-lg font-medium underline-offset-4 transition-colors hover:underline"
        >
          {item.title}
        </Link>
      ))}
    </>
  )
}
