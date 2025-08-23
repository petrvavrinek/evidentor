"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
} from "@evidentor/ui/components/ui/card";
import { TypographyH3 } from "@evidentor/ui/components/ui/typography";

import UpdateUserBillingForm from "@/components/user-billing/update-user-billing-form";
import { getUserBillingOptions, putUserBillingMutation } from "@/lib/api/@tanstack/react-query.gen";
import { authClient } from "@/lib/auth-client";
import UpdateProfileForm from "./update-profile-form";

export default function Profile() {
	const { data } = authClient.useSession();
	if (!data?.user) return;

	const { user } = data;

	const { data: userBilling, isLoading } = useQuery(getUserBillingOptions());
	const userBillingMutation = useMutation({
		...putUserBillingMutation(),
		onSuccess: () => {
			toast.info("User billing set!");
		}
	});

	if (isLoading) return <>Loading...</>;

	return (
		<>
			<div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-2">
				<Card className="shadow-none h-fit">
					<CardHeader>
						<TypographyH3>Personal profile</TypographyH3>
					</CardHeader>
					<CardContent className="space-y-4">
						<UpdateProfileForm
							initialData={{ email: user.email, name: user.name, avatar: user.image ?? undefined }}
							onUpdate={(e) => {
								authClient.updateUser({ name: e.name }).then(() => {
									toast.info("User profile set");
								});
							}}
						/>
					</CardContent>
				</Card>

				<Card className="shadow-none">
					<CardHeader>
						<TypographyH3>Business profile</TypographyH3>
					</CardHeader>
					<CardContent className="space-y-4">
						<UpdateUserBillingForm initialData={userBilling} onUpdate={e => {
							userBillingMutation.mutate({ body: e });
						}} />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
