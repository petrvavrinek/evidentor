"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { Tabs, TabsContent } from "@evidentor/ui/components/ui/tabs";

import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authClient } from "@/lib/auth-client";

export default function AuthPage() {
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
						<Link href="/auth/password-reset" className="underline underline-offset-4">Forgot your password?</Link>
					</div>
					<div className="text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link
							href="?action=signup"
							className="underline underline-offset-4"
						>
							Sign up
						</Link>
					</div>
				</SignInForm>
			</TabsContent>

			<TabsContent value="signup">
				<SignUpForm>
					<div className="text-center text-sm">
						Already have an account?{" "}
						<Link
							href="?action=signin"
							className="underline underline-offset-4"
							onClick={() => setActiveTab("signin")}
						>
							Sign in
						</Link>
					</div>
				</SignUpForm>
			</TabsContent>
		</Tabs>
	);
}
