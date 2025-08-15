"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Tabs, TabsContent } from "@evidentor/ui/components/ui/tabs";

import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authClient } from "@/lib/auth-client";

export default function AuthPage() {
	const tSignIn = useTranslations("auth.forms.signin");
	const tSignUp = useTranslations("auth.forms.signup");

	const [activeTab, setActiveTab] = useState("signin");
	useEffect(() => {
		authClient.getSession().then((session) => {
			if (session.data) redirect("/app");
		});
	}, []);

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} searchParam="action">
			<TabsContent value="signin">
				<SignInForm>
					<div className="text-center text-sm">
						<Link href="/auth/password-reset" className="underline underline-offset-4">{tSignIn("forgotPassword")}</Link>
					</div>
					<div className="text-center text-sm">
						{tSignIn("dontHaveAccount")}
						<Link
							href="?action=signup"
							className="underline underline-offset-4"
						>
							{" "}{tSignIn("signUp")}
						</Link>
					</div>
				</SignInForm>
			</TabsContent>

			<TabsContent value="signup">
				<SignUpForm>
					<div className="text-center text-sm">
						{tSignUp("alreadyRegistered")}{" "}
						<Link
							href="?action=signin"
							className="underline underline-offset-4"
							onClick={() => setActiveTab("signin")}
						>
							{tSignUp("signIn")}
						</Link>
					</div>
				</SignUpForm>
			</TabsContent>
		</Tabs>
	);
}
