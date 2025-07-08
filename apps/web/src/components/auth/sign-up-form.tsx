import { cn } from "@/lib/utils";
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

import { authClient } from "@/lib/auth-client";

interface RegisterFormProps {
	className?: React.ComponentProps<"div">["className"];
	children?: React.ComponentProps<"div">["children"];
}

const FormSchema = z.object({
	email: z.string().email(),
	fullName: z.string(),
	password: z.string(),
});

type FormData = z.infer<typeof FormSchema>;

export function SignUpForm({ className, children }: RegisterFormProps) {
	const [loading, setLoading] = useState(false);
	// const [createdUser, setCreatedUser] = useState<User | undefined>();
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const form = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {},
	});

	const onSubmitComponent = async (e: FormData) => {
		setLoading(true);
		const result = await authClient.signUp.email({
			email: e.email,
			name: e.fullName,
			password: e.password,
		});

		try {
			if (result.error?.message) return setErrorMessage(result.error.message);

			// setCreatedUser(result?.data?.user);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)}>
			{errorMessage && (
				<Alert variant="destructive">
					<AlertTitle>Sign-up error</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmitComponent)}>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-6">
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="email@example.com" {...field} />
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
											<Input placeholder="..." {...field} type="password" />
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
								Sign up with Email
							</LoadableButton>
						</div>
					</div>
				</form>
			</Form>
			<div className="flex flex-col items-center gap-2">{children}</div>
		</div>
	);
}

export type SignUpAuthData = FormData;
