import Link from "next/link"
import { BookOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CommandMenu } from "@/components/command-menu"
import { LogoButton } from "@/components/logo-button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { SignOutButton } from "@/components/auth/sign-out-button"

export function SiteHeader() {
  return (
    <header
      className={cn(
        "supports-backdrop-blur:bg-background/90 bg-background/40 border-border sticky top-0 z-40 w-full border-b backdrop-blur-lg"
      )}
    >
      <div className="container flex h-14 flex-shrink-0 items-center gap-3">
        <MobileNav />
        <LogoButton />
        <MainNav />
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="w-fit">
            <CommandMenu />
          </div>
          <nav className="flex items-center gap-2">
            <ModeToggle />
            <SignOutButton />
            <Link
              className={cn(
                buttonVariants({
                  variant: "rainbow",
                  size: "sm",
                })
              )}
              href="/docs"
            >
              <div className="inline lg:hidden">Wiki</div>
              <div className="hidden lg:inline">Open team wiki</div>
              <BookOpen className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
