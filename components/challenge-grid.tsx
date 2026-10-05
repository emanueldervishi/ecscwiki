import Link from "next/link"
import { allDocs } from "content-collections"

import { DbChallenges } from "@/components/contrib/db-challenges"

interface ChallengeGridProps {
  /** Folder under content/docs, e.g. "training/pwn". */
  category: string
}

const NON_CHALLENGE = new Set(["tools", "resources"])

export function getChallengeDocs(category: string) {
  const prefix = `${category}/`
  return allDocs
    .filter((doc) => {
      if (!doc.published || !doc.slugAsParams.startsWith(prefix)) return false
      const rest = doc.slugAsParams.slice(prefix.length)
      return rest.length > 0 && !rest.includes("/") && !NON_CHALLENGE.has(rest)
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function ChallengeGrid({ category }: ChallengeGridProps) {
  const docs = getChallengeDocs(category)

  if (!docs.length) {
    return (
      <p className="text-muted-foreground mt-6 text-sm">
        No challenge types documented yet.
      </p>
    )
  }

  const slug = category.replace(/^training\//, "")

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((doc) => (
        <Link
          key={doc.slug}
          href={doc.slug}
          title={doc.description}
          className="text-foreground/90 hover:text-foreground py-1 text-lg font-medium underline-offset-4 transition-colors hover:underline"
        >
          {doc.title}
        </Link>
      ))}
      <DbChallenges category={slug} />
    </div>
  )
}
