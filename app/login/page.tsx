import { Suspense } from "react"
import type { Metadata } from "next"

import { Icons } from "@/components/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in | ECSC Albania Wiki",
  description: "Sign in to the ECSC Albania team wiki.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-none">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex items-center gap-2">
            <Icons.logo className="size-7" />
            <span className="text-lg font-bold">ECSC Albania</span>
          </div>
          <CardTitle>Team wiki</CardTitle>
          <CardDescription>Sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
