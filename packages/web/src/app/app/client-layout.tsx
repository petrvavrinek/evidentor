"use client";

import { AppSidebar } from "@/components/app-sidebar";
import AuthProtect from "@/components/auth/auth-redirect";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import VersionTag from "@/components/version-tag";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<AuthProtect>
				<SidebarProvider
					style={
						{
							"--sidebar-width": "calc(var(--spacing) * 72)",
							"--header-height": "calc(var(--spacing) * 12)",
						} as React.CSSProperties
					}
				>
					<AppSidebar />
					<SidebarInset>
						<div className="p-2 h-full">
							<div className="flex-1 p-4 md:p-6 md:ml-0">{children}</div>
						</div>
					</SidebarInset>
					<VersionTag />
				</SidebarProvider>
			</AuthProtect>
		</ThemeProvider>
	);
}
