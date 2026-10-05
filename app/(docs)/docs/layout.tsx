import { Suspense } from "react"

import { docsConfig } from "@/config/docs"
import { DocsSidebarNav } from "@/components/sidebar-nav"
import { CategoryNav } from "@/components/category-nav"
import { ThemePreview } from "@/components/theme-preview"

interface DocsLayoutProps {
	children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
	return (
		<div className="relative isolate grid h-[calc(100vh-4rem)] grid-cols-[var(--sidebar-width)_var(--gutter-width)_auto_var(--gutter-width)] grid-rows-[1fr] overflow-hidden [--gutter-width:--spacing(6)] [--sidebar-width:0] 2xl:[--gutter-width:--spacing(10)] 2xl:[--sidebar-width:--spacing(72)]">
			<div className="col-start-2 row-span-full row-start-1 border-x border-x-(--color-secondary) bg-[repeating-linear-gradient(315deg,var(--color-secondary)_0,var(--color-secondary)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed max-2xl:hidden"></div>
			<div className="col-start-4 row-span-full row-start-1 border-x border-x-(--color-secondary) bg-[repeating-linear-gradient(315deg,var(--color-secondary)_0,var(--color-secondary)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed max-2xl:hidden"></div>
			<aside className="sticky top-14 left-0 z-10 flex h-[calc(100vh-3.5rem)] w-[var(--sidebar-width)] flex-col max-2xl:hidden">
				<DocsSidebarNav items={docsConfig.sidebarNav} />
			</aside>
			<div className="col-start-3 row-start-1 h-full overflow-y-auto max-2xl:col-span-full max-2xl:col-start-1">
				<Suspense fallback={children}>
					<ThemePreview showColorPicker={false}>{children}</ThemePreview>
				</Suspense>
				<CategoryNav />
			</div>
		</div>
	)
}
