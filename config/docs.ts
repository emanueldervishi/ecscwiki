import type { MainNavItem, SidebarNavItem } from "@/types"

interface DocsConfig {
	mainNav: MainNavItem[]
	sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
	mainNav: [
		{ title: "Wiki", href: "/docs" },
		{ title: "Training", href: "/docs/training/pwn" },
		{ title: "Operations", href: "/docs/operations/competition-day" },
		{ title: "References", href: "/docs/references/cheatsheets" },
	],
	sidebarNav: [
		{
			title: "Team handbook",
			items: [
				{ title: "Wiki home", href: "/docs", items: [] },
				{
					title: "Start here",
					href: "/docs/onboarding/start-here",
					items: [],
				},
				{
					title: "Code of conduct",
					href: "/docs/onboarding/code-of-conduct",
					items: [],
				},
			],
		},
		{
			title: "Training tracks",
			items: [
				{
					title: "Binary exploitation",
					href: "/docs/training/pwn",
					items: [],
				},
				{ title: "Web security", href: "/docs/training/web", items: [] },
				{
					title: "Reverse engineering",
					href: "/docs/training/reverse-engineering",
					items: [],
				},
				{
					title: "Cryptography",
					href: "/docs/training/cryptography",
					items: [],
				},
				{ title: "Forensics", href: "/docs/training/forensics", items: [] },
			],
		},
		{
			title: "Team operations",
			items: [
				{
					title: "Communication",
					href: "/docs/operations/communication",
					items: [],
				},
				{
					title: "Competition day",
					href: "/docs/operations/competition-day",
					items: [],
				},
				{
					title: "Write-up standard",
					href: "/docs/operations/writeup-standard",
					items: [],
				},
			],
		},
		{
			title: "Infrastructure",
			items: [
				{
					title: "Lab access",
					href: "/docs/infrastructure/lab-access",
					items: [],
				},
				{
					title: "Core tooling",
					href: "/docs/infrastructure/tooling",
					items: [],
				},
			],
		},
		{
			title: "References",
			items: [
				{
					title: "Tools",
					href: "/docs/references/tools",
					items: [],
				},
				{
					title: "Resources",
					href: "/docs/references/resources",
					items: [],
				},
				{
					title: "Cheat sheets",
					href: "/docs/references/cheatsheets",
					items: [],
				},
				{
					title: "Write-up archive",
					href: "/docs/references/writeups",
					items: [],
				},
			],
		},
	],
}
