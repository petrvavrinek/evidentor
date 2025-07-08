"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

import { client } from "@/lib/api/client.gen";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";

interface AuthProtectProps {
	children?: React.ReactNode;
}

export default function AuthProtect({ children }: AuthProtectProps) {
	const router = useRouter();
	const session = authClient.useSession();
	const [isMounted, setIsMounted] = useState(false);
	const [clientProvider, setClientProvider] = useState<QueryClient>();
	const [clientCredentialsSet, setClientCredentialsSet] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (isMounted && !session.isPending && !session.data) {
			router.replace("/auth");
		}

		// Init client once
		if (!clientProvider) setClientProvider(new QueryClient());
	}, [isMounted, session.isPending, session.data, router, clientProvider]);

	useEffect(() => {
		if (session.data?.session.token) {
			// Configure internal service client
			client.setConfig({
				credentials: "include",
				headers: {
					Authorization: `Bearer ${session.data.session.token}`,
				},
			});
			setClientCredentialsSet(true);
		}
	}, [session]);

	if (
		!isMounted ||
		session.isPending ||
		!clientProvider ||
		!clientCredentialsSet
	) {
		return <Skeleton className="w-full h-1.5" />;
	}

	if (!session.data) return <p>Redirecting...</p>;

	return (
		<QueryClientProvider client={clientProvider}>
			{children}
		</QueryClientProvider>
	);
}
