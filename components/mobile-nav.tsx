"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"

import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { useIsMobileOrTablet } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { LogoButton } from "./logo-button"

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const isMobileOrTablet = useIsMobileOrTablet()

  if (!isMobileOrTablet) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
            className
          )}
        >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  open ? "top-[0.4rem] -rotate-45" : "top-1"
                )}
              />
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  open ? "top-[0.4rem] rotate-45" : "top-2.5"
                )}
              />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-background/80 no-scrollbar m-2 h-[98%] w-[80%] max-w-full gap-0 overflow-hidden rounded-lg border p-0 shadow-none backdrop-blur"
      >
        <div className="relative h-full">
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="from-background via-background absolute bottom-0 left-0 h-5 w-full bg-gradient-to-t to-transparent"></div>
            <div className="bg-muted sticky top-0 border-b p-4">
              <LogoButton />
            </div>
            <div className="flex flex-col gap-2 p-4">
              <div className="text-muted-foreground text-sm font-medium">
                Menu
              </div>
              <div className="flex flex-col gap-2">
                {docsConfig.mainNav?.map(
                  (item, index) =>
                    item.href && (
                      <MobileLink
                        key={index}
                        href={item.href}
                        onOpenChange={setOpen}
                      >
                        <span className="flex items-center gap-2">
                          {item.title}
                          {item.label && (
                            <span className="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                              {item.label}
                            </span>
                          )}
                        </span>
                      </MobileLink>
                    )
                )}
              </div>
            </div>
            <div className="flex flex-col gap-8 p-4">
              {docsConfig.sidebarNav.map((section, index) => {
                return (
                  <div
                    key={`${section.title}-${index}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="text-muted-foreground text-sm font-medium">
                      {section.title}
                    </div>
                    <div className="flex flex-col gap-2">
                      {section.items?.map(
                        (item) =>
                          !item.disabled &&
                          item.href && (
                            <MobileLink
                              key={item.href}
                              href={item.href}
                              onOpenChange={setOpen}
                            >
                              <span className="flex items-center gap-2">
                                {item.title}
                                {item.label && (
                                  <span className="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                                    {item.label}
                                  </span>
                                )}
                              </span>
                            </MobileLink>
                          )
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  onClick,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
        onClick?.()
      }}
      className={cn("text-xl font-medium", className)}
      {...props}
    >
      {children}
    </Link>
  )
}
