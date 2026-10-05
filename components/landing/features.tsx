import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import {
	Binary,
	Braces,
	ChevronRight,
	Fingerprint,
	KeyRound,
	Radar,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface WikiArea {
	description: string
	href: string
	icon: LucideIcon
	id: string
	name: string
	resources: string[]
	terminal: string[]
}

const wikiAreas: WikiArea[] = [
	{
		id: "pwn",
		name: "Binary exploitation",
		description:
			"From stack fundamentals to modern heap exploitation, with a repeatable workflow for triage, debugging, and reliable solves.",
		href: "/docs/training/pwn",
		icon: Binary,
		resources: ["GDB + pwndbg", "pwntools", "glibc notes"],
		terminal: ["$ checksec ./challenge", "RELRO: Full", "Canary: Found", "NX: Enabled"],
	},
	{
		id: "web",
		name: "Web security",
		description:
			"A practical method for mapping applications, finding broken trust boundaries, and documenting exploit chains without losing evidence.",
		href: "/docs/training/web",
		icon: Braces,
		resources: ["Burp Suite", "request maps", "payload notes"],
		terminal: ["POST /api/session HTTP/1.1", "Host: target.local", "X-Role: member", "→ trace authorization"],
	},
	{
		id: "reverse-engineering",
		name: "Reverse engineering",
		description:
			"Fast static and dynamic analysis for native binaries, bytecode, and obfuscated challenge programs.",
		href: "/docs/training/reverse-engineering",
		icon: Radar,
		resources: ["Ghidra", "gdb", "deobfuscation"],
		terminal: ["$ file ./unknown", "ELF 64-bit LSB", "$ strings -n 8 ./unknown", "→ begin triage"],
	},
	{
		id: "cryptography",
		name: "Cryptography",
		description:
			"Recognition patterns, mathematical tools, and implementation mistakes that turn intimidating crypto tasks into tractable problems.",
		href: "/docs/training/cryptography",
		icon: KeyRound,
		resources: ["SageMath", "number theory", "attack catalog"],
		terminal: ["n = p × q", "φ(n) = (p-1)(q-1)", "d = e⁻¹ mod φ(n)", "→ verify assumptions"],
	},
	{
		id: "forensics",
		name: "Digital forensics",
		description:
			"Preserve evidence, build timelines, and recover signal from disk, memory, network, and metadata artifacts.",
		href: "/docs/training/forensics",
		icon: Fingerprint,
		resources: ["Volatility", "Wireshark", "file carving"],
		terminal: ["$ sha256sum evidence.raw", "a8c4…  evidence.raw", "$ file evidence.raw", "→ work on a copy"],
	},
]

export default function FeaturesSection() {
	return (
		<section id="training" className="container flex flex-col gap-10 py-14 lg:px-12">
			<div className="mx-auto max-w-3xl text-center">
				<p className="text-sm font-semibold tracking-[0.18em] text-red-500 uppercase">
					Training tracks
				</p>
				<h2 className="text-foreground mt-3 text-3xl font-semibold tracking-tight text-balance md:text-5xl">
					A shared operating system for every challenge category
				</h2>
				<p className="text-muted-foreground mt-4 font-medium text-balance">
					Each track combines fundamentals, team conventions, tooling, and a path
					from first look to final write-up.
				</p>
			</div>

			{wikiAreas.map((area, index) => {
				const Icon = area.icon
				return (
					<article id={area.id} key={area.id}>
						<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-8 xl:mx-0 xl:max-w-none xl:grid-cols-5">
							<div
								className={cn("m-auto xl:col-span-2", {
									"xl:order-last": index % 2 === 1,
								})}
							>
								<div className="border-border bg-muted mb-5 flex size-10 items-center justify-center rounded-lg border">
									<Icon className="size-5" />
								</div>
								<h3 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
									{area.name}
								</h3>
								<p className="text-muted-foreground mt-3 font-medium">
									{area.description}
								</p>
								<div className="mt-5 flex flex-wrap gap-2">
									{area.resources.map((resource) => (
										<span
											key={resource}
											className="bg-muted text-muted-foreground rounded-md px-2.5 py-1 font-mono text-xs"
										>
											{resource}
										</span>
									))}
								</div>
								<Link
									href={area.href}
									className={cn(
										buttonVariants({ variant: "outline", size: "lg" }),
										"group mt-7 gap-2 rounded-xl"
									)}
								>
									Open track
									<ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</div>

							<div className="border-border bg-card m-auto w-full overflow-hidden rounded-xl border shadow-xs xl:col-span-3">
								<div className="border-border bg-muted/50 flex items-center gap-2 border-b px-4 py-3">
									<span className="size-2.5 rounded-full bg-red-500" />
									<span className="size-2.5 rounded-full bg-amber-400" />
									<span className="size-2.5 rounded-full bg-emerald-500" />
									<span className="text-muted-foreground ml-2 font-mono text-xs">
										team@ecsc-al ~/{area.id}
									</span>
								</div>
								<div className="min-h-64 p-6 font-mono text-sm leading-7 md:p-8">
									{area.terminal.map((line, lineIndex) => (
										<p
											key={line}
											className={cn(
												lineIndex === 0 ? "text-foreground" : "text-muted-foreground"
											)}
										>
											{line}
										</p>
									))}
									<div className="bg-muted mt-7 h-px w-full" />
									<p className="text-muted-foreground mt-6 text-xs leading-6">
										Document the path. Share the artifact. Make the next solve faster.
									</p>
								</div>
							</div>
						</div>
					</article>
				)
			})}
		</section>
	)
}
