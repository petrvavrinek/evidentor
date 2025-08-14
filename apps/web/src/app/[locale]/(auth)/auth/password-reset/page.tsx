"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { NewPasswordResetSubmitForm } from "@/components/auth/new-password-reset-form";
import { PasswordResetReqestForm } from "@/components/auth/password-reset-request-form";
import { Button } from "@evidentor/ui/components/ui/button";

function PasswordReset() {
	const [passwordReset, setPasswordReset] = useState(false);

	const query = useSearchParams();
	const containToken = useMemo(() => query.has("token"), [query]);

	if (passwordReset) {
		return (
			<div className="flex flex-col">
				<p className="py-2">Password set. You can login now.</p>
				<Link href="/auth">
					<Button className="w-full">
						<Send />
						Back to login
					</Button>
				</Link>
			</div>
		);
	}

	if (containToken)
		return (
			<NewPasswordResetSubmitForm
				token={query.get("token") ?? undefined}
				onReset={() => setPasswordReset(true)}
			/>
		);

	if (!passwordReset) return <PasswordResetReqestForm />;
}

export default function PasswordResetSuspensePage() {
	return (
		<Suspense>
			<PasswordReset />
		</Suspense>
	);
}
