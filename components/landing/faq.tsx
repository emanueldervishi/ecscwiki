"use client"

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
	{
		question: "Who is this wiki for?",
		answer:
			"It is the working knowledge base for ECSC Albania candidates, selected team members, coaches, and approved contributors. Public pages can also help new competitors understand how the team trains.",
	},
	{
		question: "Where should a new member begin?",
		answer:
			"Start with the onboarding checklist, set up an isolated lab, choose one primary training track, and complete its baseline exercises before branching into a second category.",
	},
	{
		question: "How should I contribute a write-up?",
		answer:
			"Use the team write-up standard. Include the challenge statement, artifacts, environment, analysis, exploit or solve path, flag retrieval, and lessons that transfer to future tasks.",
	},
	{
		question: "Can sensitive competition material be posted here?",
		answer:
			"Only publish material permitted by the event rules and the team's information policy. Never post live flags, credentials, private infrastructure details, or embargoed challenge content.",
	},
	{
		question: "What language should documentation use?",
		answer:
			"Use clear English for technical documentation so tools, commands, and external references remain consistent. Team coordination may use Albanian when that is faster and clearer.",
	},
]

export default function Faq() {
	return (
		<section id="faqs" className="container py-14 lg:px-12">
			<div className="mb-12 flex flex-col gap-3">
				<h2 className="text-foreground text-center text-2xl font-semibold tracking-tight md:text-5xl">
					Common questions
				</h2>
				<p className="text-foreground/70 text-center font-medium tracking-tight text-balance md:text-lg">
					The basics for joining, contributing, and handling team knowledge.
				</p>
			</div>

			<Accordion
				type="single"
				collapsible
				className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border"
			>
				{faqs.map((faq) => (
					<AccordionItem key={faq.question} value={faq.question} className="w-full">
						<AccordionTrigger className="cursor-pointer p-4 text-left text-lg hover:no-underline">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground px-4 text-sm leading-6 font-medium md:text-base">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	)
}
