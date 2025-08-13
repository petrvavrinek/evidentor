"use client";

import { client } from "@/lib/api/client.gen";
import Providers from "./providers";

import "../../globals.css";

// Must be set manually
client.setConfig({
	baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Providers>{children}</Providers>
	);
}
