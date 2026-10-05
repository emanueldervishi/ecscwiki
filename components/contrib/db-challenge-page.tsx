"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRightIcon } from "@radix-ui/react-icons"

import { getTrainingCategory } from "@/config/training"
import { getChallengeType } from "@/lib/supabase/queries"
import type { DbChallengeType } from "@/lib/supabase/types"
import { AboutEditor } from "@/components/contrib/about-editor"
import { ContributionSection } from "@/components/contrib/contribution-section"
import { SolvedTable } from "@/components/solved-table"

const KIND_LABEL: Record<string, string> = {
  analyze: "Analyze",
  solution: "Solution",
  script: "Scripts",
  solved: "Solved challenges",
}

export function DbChallengePage({
  category,
  slug,
  kind,
}: {
  category: string
  slug: string
  kind?: string
}) {
  const [challenge, setChallenge] = useState<DbChallengeType | null | "loading">(
    "loading"
  )

  useEffect(() => {
    let active = true
    getChallengeType(category, slug).then((c) => {
      if (active) setChallenge(c)
    })
    return () => {
      active = false
    }
  }, [category, slug])

  const cat = getTrainingCategory(category)
  const challengeKey = `${category}/${slug}`

  if (challenge === "loading") {
    return (
      <div className="relative mx-auto my-6 max-w-[120ch] px-6 lg:my-16">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="relative mx-auto my-6 max-w-[120ch] px-6 lg:my-16">
        <h1 className="text-2xl font-bold">Not found</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This challenge type does not exist.{" "}
          <Link href={`/docs/training/${category}`} className="underline">
            Back to {cat?.label ?? category}
          </Link>
        </p>
      </div>
    )
  }

  const title = kind ? `${challenge.title}` : challenge.title

  return (
    <div className="relative mx-auto my-6 max-w-[120ch] px-6 lg:my-16">
      <div className="text-muted-foreground mb-4 flex items-center space-x-1 text-sm">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          Docs
        </Link>
        <ChevronRightIcon className="h-4 w-4" />
        <Link
          href={`/docs/training/${category}`}
          className="hover:text-foreground transition-colors"
        >
          {cat?.label ?? category}
        </Link>
        <ChevronRightIcon className="h-4 w-4" />
        {kind ? (
          <>
            <Link
              href={`/docs/training/${category}/${slug}`}
              className="hover:text-foreground transition-colors"
            >
              {challenge.title}
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {KIND_LABEL[kind] ?? kind}
            </span>
          </>
        ) : (
          <span className="text-foreground font-medium">{challenge.title}</span>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          {kind ? KIND_LABEL[kind] ?? kind : title}
        </h1>
        {!kind && challenge.description && (
          <p className="text-muted-foreground text-lg">
            {challenge.description}
          </p>
        )}
      </div>

      <div className="pt-8 pb-12">
        {!kind && <AboutEditor challenge={challengeKey} heading="About" />}
        {(kind === "analyze" ||
          kind === "solution" ||
          kind === "script") && (
          <ContributionSection
            challenge={challengeKey}
            kind={kind}
            category={category}
            slug={slug}
          />
        )}
        {kind === "solved" && (
          <SolvedTable category={category} slug={slug} />
        )}
      </div>
    </div>
  )
}
