import Hero from "@/components/landing/hero"

export default function Home() {
	return (
		<div className="relative flex flex-1 flex-col gap-8">
			<div className="relative container mx-auto flex flex-1 flex-col">
				<div className="border-primary/5 text-primary/5 absolute top-0 left-0 h-full w-4 border-x bg-[repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] bg-size-[10px_10px] lg:w-14" />
				<div className="border-primary/5 text-primary/5 absolute top-0 right-0 h-full w-4 border-x bg-[repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] bg-size-[10px_10px] lg:w-14" />
				<Hero />
			</div>
		</div>
	)
}
