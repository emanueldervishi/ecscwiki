import { BookOpenCheck, MessagesSquare, ShieldCheck } from "lucide-react"

const principles = [
	{
		title: "Write it down",
		description:
			"A solve that lives only in one person's terminal is temporary. Capture commands, assumptions, dead ends, and the final reasoning.",
		icon: BookOpenCheck,
		label: "Knowledge",
	},
	{
		title: "Signal early",
		description:
			"Claim challenges clearly, post blockers quickly, and hand off with context. Quiet duplication costs more than asking for help.",
		icon: MessagesSquare,
		label: "Coordination",
	},
	{
		title: "Protect the team",
		description:
			"Use isolated environments, preserve evidence, and keep credentials out of notes. Strong operations are part of strong technical work.",
		icon: ShieldCheck,
		label: "Discipline",
	},
]

export default function Testimonials() {
	return (
		<section id="principles" className="container mx-auto py-14 lg:px-12">
			<div className="mx-auto mb-10 max-w-3xl text-center">
				<p className="text-sm font-semibold tracking-[0.18em] text-red-500 uppercase">
					Team standard
				</p>
				<h2 className="text-foreground mt-3 text-3xl leading-[1.2] font-semibold tracking-tighter text-balance md:text-5xl">
					How we work when the clock is running
				</h2>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{principles.map((principle) => {
					const Icon = principle.icon
					return (
						<article
							key={principle.title}
							className="border-border bg-card group rounded-xl border p-6 shadow-xs transition-transform duration-200 hover:-translate-y-1"
						>
							<div className="border-border bg-muted flex size-10 items-center justify-center rounded-lg border">
								<Icon className="size-5" />
							</div>
							<p className="text-muted-foreground mt-8 font-mono text-xs tracking-[0.16em] uppercase">
								{principle.label}
							</p>
							<h3 className="mt-2 text-xl font-semibold tracking-tight">
								{principle.title}
							</h3>
							<p className="text-muted-foreground mt-3 text-sm leading-6">
								{principle.description}
							</p>
						</article>
					)
				})}
			</div>
		</section>
	)
}
