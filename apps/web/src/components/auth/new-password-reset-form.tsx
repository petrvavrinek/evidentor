"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@evidentor/ui/components/ui/alert";
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
import { useState } from "react";
import { useTranslations } from "next-intl";

const FormSchema = z.object({
	password: z.string().min(6),
	passwordAgain: z.string().min(6),
});

type FormData = z.infer<typeof FormSchema>;

interface NewPasswordResetSubmitForm {
	// If password is from link request
	token?: string;

	onReset?: () => void;
}

export function NewPasswordResetSubmitForm({
	token,
	onReset,
}: NewPasswordResetSubmitForm) {
	const t = useTranslations("auth.forms.resetPassword.submit");

	const [errorMessage, setErrorMessage] = useState<string>();
	const [loading, setLoading] = useState(false);
	const form = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {},
	});

	const onSubmitComponent = async (e: FormData) => {
		if (e.password !== e.passwordAgain) {
			form.setError("password", { message: "Passwords must be same" });
			form.setError("passwordAgain", { message: "Passwords must be same" });
			return;
		} else {
			form.clearErrors("password");
			form.clearErrors("passwordAgain");
		}
		setLoading(true);

		const result = await authClient.resetPassword({
			newPassword: e.password,
			token,
		});

		setLoading(false);

		if (result.error) {
			setErrorMessage(result.error.message ?? "unknown error");
			return;
		}

		if (result.data.status) {
			onReset?.();
		}
	};

	return (
		<div className={cn("flex flex-col gap-6")}>
			{errorMessage && (
				<Alert variant="destructive">
					<AlertTitle>Password reset error</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmitComponent)}>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-6">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("password")}</FormLabel>
										<FormControl>
											<Input {...field} type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="passwordAgain"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("passwordAgain")}</FormLabel>
										<FormControl>
											<Input {...field} type="password" />
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
								{t("submit")}
							</LoadableButton>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}

export type SignInAuthData = FormData;
