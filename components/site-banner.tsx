import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function SiteBanner() {
	return (
		<Link
			href="/docs/operations/competition-day"
			className="group bg-primary text-primary-foreground relative top-0 block py-2 transition-colors"
		>
			<div className="container flex items-center justify-center text-center text-xs font-medium md:text-sm">
				<span className="mr-2 font-mono opacity-70">TEAM NOTE</span>
				Review the competition-day playbook before every event.
				<ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
			</div>
		</Link>
	)
}
