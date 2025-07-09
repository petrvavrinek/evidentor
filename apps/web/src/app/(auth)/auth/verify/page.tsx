"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function AuthPage() {
	const [verifyStatus, setVerifyStatus] = useState<boolean | undefined>(false);
	const [tokenUser, setTokenUser] = useState<User | null>(null);
	const [verificationEmailSent, setVerificationEmailSent] = useState(false);

	const query = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const token = query.get("token");
		if (!token) return;

		authClient.verifyEmail({ query: { token } }).then((e) => {
			console.log(e);

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
				<AlertTitle>No token found</AlertTitle>
				<AlertDescription>
					Missing token, if you came from your verification email, try to sign
					in once again and request token one more time.
					<Button variant="destructive">
						<ArrowLeft />
						<Link href={"/auth"}>Go back to login</Link>
					</Button>
				</AlertDescription>
			</Alert>
		);
	}

	if (verifyStatus === undefined) {
		return <div>Loading...</div>;
	}

	if (verifyStatus) {
		return (
			<>
				<div>Verification successful!</div>
				<div>You will be redirected to dashboard in few seconds...</div>
			</>
		);
	}

	return (
		<Alert>
			<AlertTitle>Verification unsuccessful</AlertTitle>
			<AlertDescription>
				Token is invalid or timeouted.
				{tokenUser && (
					<div>
						You can try to reqeust new one:
						{verificationEmailSent ? (
							<Button disabled>
								<Check />
								Verification email sent
							</Button>
						) : (
							<Button onClick={() => sendVerificationEmail(tokenUser)}>
								<Send />
								Send new verification email
							</Button>
						)}
					</div>
				)}
			</AlertDescription>
		</Alert>
	);
}
