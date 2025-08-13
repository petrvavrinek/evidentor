"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { User } from "better-auth";
import { ArrowLeft, Check, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@evidentor/ui/components/ui/alert";
import { Button } from "@evidentor/ui/components/ui/button";
import { useTranslations } from "next-intl";


function AuthPage() {
	const t = useTranslations("auth.alerts.verify");
	const tGeneric = useTranslations("generic");

	const [verifyStatus, setVerifyStatus] = useState<boolean | undefined>(false);
	const [tokenUser, setTokenUser] = useState<User | null>(null);
	const [verificationEmailSent, setVerificationEmailSent] = useState(false);

	const query = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const token = query.get("token");
		if (!token) return;

		authClient.verifyEmail({ query: { token } }).then((e) => {
			setVerifyStatus(e.data?.status ?? false);
			setTokenUser(e.data?.user ?? null);

			if (e.data?.status) {
				setTimeout(() => {
					router.push("/app");
				}, 2000);
			}
		});
	}, [query, router.push]);

	const sendVerificationEmail = async (user: User) => {
		authClient.sendVerificationEmail({ email: user.email }).then((e) => {
			setVerificationEmailSent(e.data?.status ?? false);
		});
	};

	if (!query.has("token")) {
		return (
			<Alert variant="destructive">
				<AlertTitle className="font-bold">{t("missingToken.title")}</AlertTitle>
				<AlertDescription>
					{t("missingToken.message")}
					<Button variant="destructive">
						<ArrowLeft />
						<Link href={"/auth"}>{t("missingToken.goToLogin")}</Link>
					</Button>
				</AlertDescription>
			</Alert>
		);
	}

	if (verifyStatus === undefined) {
		return <div>{tGeneric("loading")}...</div>;
	}

	if (verifyStatus) {
		return (
			<>
				<div>{t("success.title")}</div>
				<div>{t("success.message")}</div>
			</>
		);
	}

	return (
		<Alert>
			<AlertTitle>{t("generic.title")}</AlertTitle>
			<AlertDescription>
				{t("generic.message")}
				{tokenUser && (
					<div>
						{t("generic.sendVerification.message")}
						{verificationEmailSent ? (
							<Button disabled>
								<Check />
								{t("generic.sendVerification.sent")}
							</Button>
						) : (
							<Button onClick={() => sendVerificationEmail(tokenUser)}>
								<Send />
								{t("generic.sendVerification.send")}
							</Button>
						)}
					</div>
				)}
			</AlertDescription>
		</Alert>
	);
}

export default function AuthSuspensePage() {
	return (
		<Suspense>
			<AuthPage />
		</Suspense>
	);
}
