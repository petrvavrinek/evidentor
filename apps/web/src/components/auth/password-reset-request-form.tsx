"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@evidentor/ui/components/ui/alert";
import { Button } from "@evidentor/ui/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import LoadableButton from "@evidentor/ui/components/ui/loadable-button";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
	email: z.string().email(),
});

type FormData = z.infer<typeof FormSchema>;

export function PasswordResetReqestForm() {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();
	const [passwordResetSent, setPasswordResetSent] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {},
	});

	const onSubmitComponent = async (e: FormData) => {
		setErrorMessage(undefined);
		setLoading(true);

		const result = await authClient.forgetPassword({ email: e.email });
		if (result.error?.message) setErrorMessage(result.error.message);
		setLoading(false);
		setPasswordResetSent(true);
	};

	return (
		<div className={cn("flex flex-col gap-6")}>
			{errorMessage && (
				<Alert variant="destructive">
					<AlertTitle>Password reset error</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}

			{passwordResetSent ? (
				<>
					<Alert>
						<AlertTitle>Sent</AlertTitle>
						<AlertDescription>
							Password reset sent. Check your email inbox.
						</AlertDescription>
					</Alert>
					<Link href={"/auth"}>
						<Button className="w-full">
							<Send />
							Back to sign in
						</Button>
					</Link>
				</>
			) : (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmitComponent)}>
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-6">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<LoadableButton
									loading={loading}
									type="submit"
									className="w-full"
								>
									Request password reset
								</LoadableButton>
							</div>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}

export type SignInAuthData = FormData;
