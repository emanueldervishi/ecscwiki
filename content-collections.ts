import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode, { type Options } from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import { codeImport } from "remark-code-import"
import remarkGfm from "remark-gfm"
import { createHighlighter } from "shiki"
import { visit } from "unist-util-visit"

const prettyCodeOptions: Options = {
  theme: {
    dark: "github-dark",
    light: "github-light-default",
  },
  keepBackground: false,
  getHighlighter: (options) =>
    createHighlighter({
      ...options,
    }),
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and allow empty
    // lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }]
    }
  },
  onVisitHighlightedLine(node) {
    if (!node.properties.className) {
      node.properties.className = []
    }
    node.properties.className.push("line--highlighted")
  },
  onVisitHighlightedChars(node) {
    if (!node.properties.className) {
      node.properties.className = []
    }
    node.properties.className = ["word--highlighted"]
  },
}

const pages = defineCollection({
  name: "Page",
  directory: "content/pages",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [codeImport, remarkGfm],
    })
    return {
      ...document,
      slug: `/${document._meta.path}`,
      slugAsParams: document._meta.path,
      body: {
        raw: document.content,
        code: body,
      },
    }
  },
})

const docs = defineCollection({
  name: "Doc",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
    published: z.boolean().default(true),
    links: z
      .object({
        doc: z.string().optional(),
        api: z.string().optional(),
      })
      .optional(),
    featured: z.boolean().default(false),
    toc: z.boolean().default(false),
    author: z.string().optional(),
    video: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const slugAsParams = document._meta.path
        .replace(/\\/g, "/")
        .replace(/\/index$/, "")

      // Generate the correct slug
      const slug =
        slugAsParams === "index" ? "/docs" : `/docs/${slugAsParams}`

      const body = await compileMDX(context, document, {
        remarkPlugins: [codeImport as any, remarkGfm as any],
        rehypePlugins: [
          rehypeSlug as any,
          () => (tree) => {
            visit(tree, (node) => {
              if (node?.type === "element" && node?.tagName === "pre") {
                const [codeEl] = node.children
                if (codeEl.tagName !== "code") {
                  return
                }
                node.__rawString__ = codeEl.children?.[0].value
              }
            })
          },
          [rehypePrettyCode, prettyCodeOptions],
          () => (tree) => {
            visit(tree, (node) => {
              if (node?.type === "element" && node?.tagName === "figure") {
                if (!("data-rehype-pretty-code-figure" in node.properties)) {
                  return
                }

                const preElement = node.children.at(-1)
                if (preElement.tagName !== "pre") {
                  return
                }

                preElement.properties["__withMeta__"] =
                  node.children.at(0).tagName === "div"
                preElement.properties["__rawString__"] = node.__rawString__
              }
            })
          },
          [
            rehypeAutolinkHeadings as any,
            {
              properties: {
                className: ["subheading-anchor"],
                ariaLabel: "Link to section",
              },
            },
          ],
        ],
      })

      return {
        ...document,
        image: `${process.env.NEXT_PUBLIC_APP_URL}/og?title=${encodeURI(
          document.title
        )}&description=${encodeURI(document.description)}`,
        slug,
        slugAsParams: slugAsParams === "index" ? "" : slugAsParams,
        body: {
          raw: document.content,
          code: body,
        },
      }
    } catch (error) {
      console.error(`❌ Failed to process: ${document._meta.path}`)
      throw error
    }
  },
})

export default defineConfig({
  collections: [pages, docs],
})
