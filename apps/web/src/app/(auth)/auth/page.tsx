"use client";

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
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			<TabsContent value="signin">
				<SignInForm>
					<div className="text-center text-sm">
						Don&apos;t have an account?{" "}
						<a
							href="#"
							className="underline underline-offset-4"
							onClick={() => setActiveTab("signup")}
						>
							Sign up
						</a>
					</div>
				</SignInForm>
			</TabsContent>

			<TabsContent value="signup">
				<SignUpForm>
					<div className="text-center text-sm">
						Already have an account?{" "}
						<a
							href="#"
							className="underline underline-offset-4"
							onClick={() => setActiveTab("signin")}
						>
							Sign up
						</a>
					</div>
				</SignUpForm>
			</TabsContent>
		</Tabs>
	);

	return;
}
