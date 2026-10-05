import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import { allDocs } from "content-collections"
import Balancer from "react-wrap-balancer"

import { getTableOfContents } from "@/lib/toc"
import { absoluteUrl, cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"
import { AboutEditor } from "@/components/contrib/about-editor"
import { AddChallengeDialog } from "@/components/contrib/add-challenge-dialog"
import { ContributionSection } from "@/components/contrib/contribution-section"
import { DbChallengePage } from "@/components/contrib/db-challenge-page"
import { EntryPage } from "@/components/contrib/entry-page"
import { Mdx } from "@/components/mdx-components"
import { DocPager } from "@/components/pager"

function TrainingContribution({ slugAsParams }: { slugAsParams: string }) {
  const segs = slugAsParams.split("/")
  if (segs[0] !== "training") return null

  // training/<cat> -> category page: offer "add a challenge type".
  if (segs.length === 2) {
    return (
      <div className="mt-8 border-t pt-6">
        <AddChallengeDialog
          defaultCategory={segs[1]}
          trigger={
            <button
              type="button"
              className="border-input hover:bg-muted inline-flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm font-medium transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              Add a challenge type
            </button>
          }
        />
      </div>
    )
  }

  // training/<cat>/<challenge> -> About page
  if (segs.length === 3 && !["tools", "resources"].includes(segs[2])) {
    return <AboutEditor challenge={`${segs[1]}/${segs[2]}`} />
  }
  // training/<cat>/<challenge>/<kind>
  if (segs.length === 4) {
    const kind = segs[3]
    if (kind === "analyze" || kind === "solution" || kind === "script") {
      return (
        <ContributionSection
          challenge={`${segs[1]}/${segs[2]}`}
          kind={kind}
          category={segs[1]}
          slug={segs[2]}
        />
      )
    }
  }
  return null
}

interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getDocFromParams({ params }: DocPageProps) {
  // Properly await the params object
  const { slug } = await params
  const slugPath = Array.isArray(slug) ? slug.join("/") : ""
  const doc = allDocs.find((doc) => doc.slugAsParams === slugPath)

  if (!doc) {
    return null
  }

  return doc
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams({ params })

  if (!doc) {
    return {}
  }

  return {
    title: `${doc.title} | ECSC Albania Wiki`,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(doc.slug),
      images: [
        {
          url: doc.image,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [doc.image],
      creator: "@ecsc_albania",
    },
  }
}

export async function generateStaticParams() {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }))
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params })

  if (!doc || !doc.published) {
    // No seeded MDX page — this may be a team-added challenge type stored in the
    // database. Render the dynamic challenge page for training challenge paths.
    const { slug } = await params
    const segs = Array.isArray(slug) ? slug : []
    // Individual entry page: training/<cat>/<challenge>/<kind>/<id>
    if (
      segs.length === 5 &&
      segs[0] === "training" &&
      ["analyze", "solution", "script"].includes(segs[3])
    ) {
      return <EntryPage id={segs[4]} />
    }
    // Team-added challenge type (no seeded MDX): about + tab pages.
    if (
      segs[0] === "training" &&
      segs[1] &&
      segs[2] &&
      !["tools", "resources"].includes(segs[2]) &&
      (segs.length === 3 || segs.length === 4)
    ) {
      return (
        <DbChallengePage
          category={segs[1]}
          slug={segs[2]}
          kind={segs[3]}
        />
      )
    }
    notFound()
  }

  const toc = await getTableOfContents(doc.body.raw)
  const parentPath = doc.slugAsParams.split("/").slice(0, -1).join("/")
  const parent = parentPath
    ? allDocs.find((d) => d.slugAsParams === parentPath)
    : undefined

  return (
    <div className={cn("relative mx-auto my-6 max-w-[120ch] px-6 lg:my-16")}>
      <div className="text-muted-foreground mb-4 flex items-center space-x-1 text-sm">
        <Link
          href="/docs"
          className="hover:text-foreground overflow-hidden text-ellipsis whitespace-nowrap transition-colors"
        >
          Docs
        </Link>
        <ChevronRightIcon className="h-4 w-4" />
        {parent && (
          <>
            <Link
              href={parent.slug}
              className="hover:text-foreground overflow-hidden text-ellipsis whitespace-nowrap transition-colors"
            >
              {parent.title}
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
          </>
        )}
        <div className="text-foreground font-medium">{doc.title}</div>
      </div>
      <div className="space-y-2">
        <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
          {doc.title}
        </h1>
        {doc.description && (
          <p className="text-muted-foreground text-lg">
            <Balancer>{doc.description}</Balancer>
          </p>
        )}
      </div>
      {doc.links ? (
        <div className="flex items-center space-x-2 pt-4">
          {doc.links?.doc && (
            <Link
              href={doc.links.doc}
              target="_blank"
              rel="noreferrer"
              className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
            >
              Docs
              <ExternalLinkIcon className="h-3 w-3" />
            </Link>
          )}
          {doc.links?.api && (
            <Link
              href={doc.links.api}
              target="_blank"
              rel="noreferrer"
              className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
            >
              API Reference
              <ExternalLinkIcon className="h-3 w-3" />
            </Link>
          )}
        </div>
      ) : null}
      <div className="pt-8 pb-12">
        <Mdx code={doc.body.code} />
        <TrainingContribution slugAsParams={doc.slugAsParams} />
      </div>
      {!doc.slugAsParams.startsWith("training/") && <DocPager doc={doc} />}

      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(doc.structuredData),
        }}
      /> */}
    </div>
  )
}
