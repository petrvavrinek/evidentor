"use client";

import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface ConnectionItemProps {
	icon?: string;
	title: string;
	description?: string;
	connected?: boolean;
	onClick?: () => void;
}

const ConnectionItem = (props: ConnectionItemProps) => {
	return (
		<Card className="py-4 gap-4">
			<CardTitle className="px-6 flex items-center">
				{props.icon && (
					<div className="pr-2">
						<Image
							src={props.icon}
							alt={props.title}
							className="w-5 h-5"
							width={128}
							height={128}
							objectFit="contain"
						/>
					</div>
				)}
				{props.title}
				<div className="grow-1 flex justify-end">
					<Button className="ml-auto" onClick={props.onClick}>
						{props.connected ? "Disconnect" : "Connect"}
					</Button>
				</div>
			</CardTitle>
			<CardContent>{props.description}</CardContent>
		</Card>
	);
};

type Account = {
	id: string;
	provider: string;
	createdAt: Date;
	updatedAt: Date;
	accountId: string;
	scopes: string[];
};

export default function ConnectionsPage() {
	const [accounts, setAccounts] = useState<Account[] | undefined>();

	useEffect(() => {
		if (!authClient) return;

		authClient.listAccounts().then((e) => {
			setAccounts(e.data ?? []);
		});
	}, []);

	const hasConnectedAccount = (name: string) => {
		if (!accounts) return false;
		return !!accounts.find((e) => e.provider === name);
	};

	return (
		<>
			{accounts ? (
				<div className="space-y-2">
					<ConnectionItem
						title="Google"
						description="Allows you to login via Google, calendar synchronization"
						connected={hasConnectedAccount("google")}
						icon="/icons/google.webp"
					/>
					<ConnectionItem
						title="Trello"
						description="Allows you to synchronize tasks"
						connected={hasConnectedAccount("trello")}
						icon="/icons/trello.svg"
					/>
				</div>
			) : (
				<Loader />
			)}
		</>
	);
}
