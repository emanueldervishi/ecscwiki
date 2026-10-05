import { Metadata } from "next"
import { notFound } from "next/navigation"
import { env } from "@/env.mjs"
import { allPages } from "content-collections"

import { siteConfig } from "@/config/site"
import { absoluteUrl } from "@/lib/utils"
import { Mdx } from "@/components/mdx-components"

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getPageFromParams({ params }: PageProps) {
  // Properly await the params object
  const { slug } = await params
  const slugPath = Array.isArray(slug) ? slug.join("/") : ""
  const page = allPages.find((page) => page.slugAsParams === slugPath)

  if (!page) {
    return null
  }

  return page
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageFromParams({ params })

  if (!page) {
    return {}
  }

  const url = env.NEXT_PUBLIC_APP_URL

  const ogUrl = new URL(`${url}/og`)
  ogUrl.searchParams.set("title", page.title)
  ogUrl.searchParams.set("description", page.description || "")
  ogUrl.searchParams.set("type", siteConfig.name)
  ogUrl.searchParams.set("mode", "light")

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      url: absoluteUrl(page.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogUrl.toString()],
    },
  }
}

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slugAsParams.split("/"),
  }))
}

export default async function PagePage({ params }: PageProps) {
  const page = await getPageFromParams({ params })

  if (!page) {
    notFound()
  }

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="font-heading inline-block text-4xl lg:text-5xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-muted-foreground text-xl">{page.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <Mdx code={page.body.code} />
    </article>
  )
}
