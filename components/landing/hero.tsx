import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Hero() {
	return (
		<section id="hero">
			<div className="relative mx-auto h-full max-w-6xl overflow-hidden py-10">
				<div className="z-10 container flex flex-col">
					<div className="mt-10 grid grid-cols-1 md:mt-20">
						<div className="mb-6 flex flex-col items-start gap-6 text-left md:items-center md:text-center">
							<Link
								href="/docs/onboarding/start-here"
								className={cn(
									buttonVariants({ variant: "outline", size: "sm" }),
									"rounded-full"
								)}
							>
								<span aria-hidden="true">🇦🇱</span>
								<Separator className="mx-2 h-4" orientation="vertical" />
								ECSC Albania knowledge base
								<ChevronRight className="text-muted-foreground ml-1 size-4" />
							</Link>

							<h1 className="text-5xl leading-none font-semibold tracking-tighter text-balance sm:text-6xl md:text-7xl">
								ECSC Albania Team Wiki
							</h1>

							<p className="text-muted-foreground max-w-2xl text-sm font-medium tracking-tight text-balance md:text-lg">
								Training material, competition playbooks, infrastructure notes,
								and challenge write-ups for the Albanian national cybersecurity
								team.
							</p>

							<div className="flex w-full flex-col justify-start gap-4 sm:w-auto sm:flex-row md:justify-center">
								<Link
									href="/docs"
									className={cn(
										buttonVariants({ size: "lg" }),
										"w-full gap-2 rounded-xl whitespace-nowrap"
									)}
								>
									Open the wiki
									<ChevronRight className="size-4" />
								</Link>
								<Link
									href="/docs/onboarding/start-here"
									className={cn(
										buttonVariants({ variant: "outline", size: "lg" }),
										"w-full gap-2 rounded-xl whitespace-nowrap"
									)}
								>
									Start here
									<ChevronRight className="size-4" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
