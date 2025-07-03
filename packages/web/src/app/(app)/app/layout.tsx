"use client";

import "../../globals.css";
import Providers from "./providers";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="aliased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
