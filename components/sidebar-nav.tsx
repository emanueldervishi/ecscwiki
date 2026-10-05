"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "@/types"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddChallengeDialog } from "@/components/contrib/add-challenge-dialog"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return (
    items.length && (
      <ScrollArea className="relative h-full flex-1">
        <div className="from-background via-background absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t to-transparent"></div>
        <div className="w-full p-6 pb-20">
          {items.map((item, index) => (
            <div key={index} className="pb-4">
              <div className="flex items-center justify-between">
                <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                  {item.title}
                </h4>
                {item.title === "Training tracks" && (
                  <AddChallengeDialog
                    trigger={
                      <button
                        type="button"
                        aria-label="Add challenge type"
                        title="Add challenge type"
                        className="text-muted-foreground hover:bg-muted hover:text-foreground mb-1 flex size-6 items-center justify-center rounded-md transition-colors"
                      >
                        <Plus className="size-4" />
                      </button>
                    }
                  />
                )}
              </div>
              {item?.items && (
                <DocsSidebarNavItems items={item.items} pathname={pathname} />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    )
  )
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max gap-1 text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group hover:bg-muted/50 hover:text-foreground flex w-full items-center rounded-md border border-transparent px-2 py-[5px] transition-all duration-200",
              item.disabled && "cursor-not-allowed opacity-60",
              pathname === item.href
                ? "text-foreground bg-muted/80 border-border font-medium"
                : "text-muted-foreground"
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <span className="shrink-0">{item.title}</span>
            {item.label && (
              <span className="ml-2 rounded-md bg-[#FFBD7A] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
            {item.external && <ExternalLinkIcon className="ml-2 size-4" />}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              "text-muted-foreground flex w-full cursor-not-allowed items-center rounded-md px-2 py-1.5 transition-all duration-200",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
          >
            {item.title}
            {item.label && (
              <span className="bg-muted text-muted-foreground ml-2 rounded-md px-1.5 py-0.5 text-xs leading-none no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null
}
