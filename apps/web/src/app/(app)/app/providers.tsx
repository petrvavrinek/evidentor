"use client";

import { AppSidebar } from "@/components/app-sidebar";
import AuthProtect from "@/components/auth/auth-redirect";
import { ThemeProvider } from "@/components/theme-provider";
import ActiveTimeEntryContainer from "@/components/time-entries/active-time-entry-container";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import VersionTag from "@/components/version-tag";
import ActiveTimeEntryProvider from "@/providers/active-time-entry-provider";

export default function Providers({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
					<ActiveTimeEntryProvider>
						<AppSidebar />
						<SidebarInset>
							<div className="p-2 h-full">
								<div className="flex-1 p-4 md:p-6 md:ml-0">{children}</div>
							</div>
						</SidebarInset>
						<ActiveTimeEntryContainer />
						<VersionTag />
						<Toaster />
					</ActiveTimeEntryProvider>
				</SidebarProvider>
			</AuthProtect>
		</ThemeProvider>
	);
}
