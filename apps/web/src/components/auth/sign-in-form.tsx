"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

import publicConfig from "@/config/public";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type FormData = z.infer<typeof FormSchema>;

interface LoginFormProps {
	className?: React.ComponentProps<"div">["className"];
	children?: React.ComponentProps<"div">["children"];
}

export function SignInForm({ children, className }: LoginFormProps) {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const form = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {},
	});

	const onSubmitComponent = async (e: FormData) => {
		setErrorMessage(undefined);
		setLoading(true);
		const result = await authClient.signIn.email({
			email: e.email,
			password: e.password,
			callbackURL: `${publicConfig.PublicUrl}/app`
		});

		if (result.error?.message) setErrorMessage(result.error.message);

		setLoading(false);
	};

	const onLoginViaGoogle = async () => {
		setErrorMessage(undefined);
		setLoading(true);
		await authClient.signIn.social({
			provider: "google",
			callbackURL: `${publicConfig.PublicUrl}/app`,
		});
		setLoading(false);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)}>
			{errorMessage && (
				<Alert variant="destructive">
					<AlertTitle>Login error</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}

			<Form {...form} >
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

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
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
								Login
							</LoadableButton>
						</div>
						<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-background text-muted-foreground relative z-10 px-2">
								Or
							</span>
						</div>
						<div className="grid gap-4 sm:grid-cols-1">
							<LoadableButton
								loading={loading}
								variant="outline"
								type="button"
								className="w-full flex items-center"
								onClick={onLoginViaGoogle}
							>
								{/** biome-ignore lint/a11y/noSvgWithoutTitle: No title prop */}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
								Continue with Google
							</LoadableButton>
						</div>
					</div>
				</form>
			</Form>
			<div className="flex flex-col items-center gap-2">{children}</div>
		</div>
	);
}

export type SignInAuthData = FormData;
