"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLinkIcon } from "@radix-ui/react-icons"

import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <nav className="hidden items-center space-x-6 text-sm font-medium xl:flex">
        {docsConfig.mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href!}
            target={item.external ? "_blank" : undefined}
            className={cn(
              "hover:text-foreground/80 flex items-center justify-center transition-colors",
              pathname?.startsWith(item.href!)
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            {item.title}
            {item.external && <ExternalLinkIcon className="ml-2 size-4" />}
          </Link>
        ))}
      </nav>
    </div>
  )
}
