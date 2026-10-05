"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  async function onSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace("/login")
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onSignOut}
      aria-label="Sign out"
      title="Sign out"
    >
      <LogOut className="size-4" />
    </Button>
  )
}
