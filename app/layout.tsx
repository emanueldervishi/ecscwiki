import type { Metadata } from "next"

import { fontMono, fontSans } from "@/lib/fonts"
import { absoluteUrl, cn, constructMetadata } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemePreviewProvider } from "@/context/theme-preview-context"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

export const metadata: Metadata = constructMetadata({
	title: "ECSC Albania Wiki",
	description:
		"Training, operations, infrastructure, and shared knowledge for the ECSC Albania team.",
	image: absoluteUrl("/og"),
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"bg-background relative flex min-h-screen w-full flex-col justify-center overflow-x-hidden scroll-smooth font-sans antialiased",
					fontSans.variable,
					fontMono.variable
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="light">
					<ThemePreviewProvider>
						<TooltipProvider>
							{children}
							<Toaster />
						</TooltipProvider>
					</ThemePreviewProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
