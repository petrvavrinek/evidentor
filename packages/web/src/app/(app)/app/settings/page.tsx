"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
	const navigation = useRouter();

	useEffect(() => {
		navigation.push("/app/settings/user");
	}, [navigation]);

	return <></>;
}
