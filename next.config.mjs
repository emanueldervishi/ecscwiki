import { fileURLToPath } from "node:url"

import { withContentCollections } from "@content-collections/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
  productionBrowserSourceMaps: true,
  compiler: {
    // Remove console.log from production except for error logs
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  images: {
    domains: [
      "localhost",
      "images.unsplash.com",
      "ui.shadcn.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/templates",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/templates",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/sections/social-proof-press",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/sections/social-proof-companies",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/sections/social-proof-testimonials",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/sections/stats",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/sections",
        destination: "/docs",
        permanent: true,
      },
    ]
  },
}

export default withContentCollections(nextConfig)
