import Link from "next/link"
import { ChevronRightIcon } from "@radix-ui/react-icons"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

const footerLinks = [
	{
		title: "Team",
		links: [
			{ title: "Home", href: "/" },
			{ title: "Start here", href: "/docs/onboarding/start-here" },
			{ title: "Code of conduct", href: "/docs/onboarding/code-of-conduct" },
		],
	},
	{
		title: "Training",
		links: [
			{ title: "Binary exploitation", href: "/docs/training/pwn" },
			{ title: "Web security", href: "/docs/training/web" },
			{ title: "Reverse engineering", href: "/docs/training/reverse-engineering" },
			{ title: "Cryptography", href: "/docs/training/cryptography" },
			{ title: "Forensics", href: "/docs/training/forensics" },
		],
	},
	{
		title: "Operations",
		links: [
			{ title: "Communication", href: "/docs/operations/communication" },
			{ title: "Competition day", href: "/docs/operations/competition-day" },
			{ title: "Write-up standard", href: "/docs/operations/writeup-standard" },
		],
	},
	{
		title: "About",
		links: [
			{ title: "Privacy", href: "/privacy" },
			{ title: "Terms", href: "/terms" },
			{ title: "License", href: "/license" },
		],
	},
]

export function SiteFooter() {
	return (
		<footer className="border-t">
			<div className="container flex flex-col gap-8 py-4 pt-16">
				<div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
					<div className="flex flex-col gap-4 lg:w-1/3">
						<div className="flex items-center space-x-2">
							<Icons.logo className="size-8" />
							<h2 className="text-xl font-bold">{siteConfig.name}</h2>
						</div>
						<p className="text-muted-foreground max-w-sm text-sm leading-6">
							{siteConfig.description}
						</p>
						<Link
							href={siteConfig.links.github}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground w-fit transition-colors"
						>
							<span className="sr-only">ECSC Albania on GitHub</span>
							<Icons.gitHub className="size-5" />
						</Link>
					</div>

					<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:flex-1">
						{footerLinks.map((section) => (
							<div key={section.title} className="space-y-3">
								<h3 className="text-sm font-medium">{section.title}</h3>
								<ul className="space-y-2">
									{section.links.map((item) => (
										<li key={item.title}>
											<Link
												href={item.href}
												className="group text-muted-foreground hover:text-foreground flex items-center text-sm transition-colors"
											>
												{item.title}
												<ChevronRightIcon className="ml-2 size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="flex size-full border-t py-3">
				<div className="container mx-auto">
					<span className="text-foreground text-sm tracking-tight">
						© {new Date().getFullYear()} {siteConfig.name}. Built for the team.
					</span>
				</div>
			</div>
		</footer>
	)
}
