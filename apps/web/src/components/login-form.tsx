import { Button } from "@evidentor/ui/components/ui/button";
import { Input } from "@evidentor/ui/components/ui/input";
import { Label } from "@evidentor/ui/components/ui/label";

import { cn } from "@/lib/utils";

interface LoginFormProps {
	className?: React.ComponentProps<"div">["className"];
	children?: React.ComponentProps<"div">["children"];
	onSubmit?: (email: string, password: string) => void;
}

export function LoginForm({ children, className, onSubmit }: LoginFormProps) {
	async function onAction(formData: FormData) {
		onSubmit?.(
			formData.get("email")?.toString() ?? "",
			formData.get("password")?.toString() ?? "",
		);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)}>
			<form action={onAction}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" placeholder="" required />
						</div>
						<Button type="submit" className="w-full">
							Login
						</Button>
					</div>
					<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
						<span className="bg-background text-muted-foreground relative z-10 px-2">
							Or
						</span>
					</div>
					<div className="grid gap-4 sm:grid-cols-1">
						<Button variant="outline" type="button" className="w-full">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
									fill="currentColor"
								/>
							</svg>
							Continue with Google
						</Button>
					</div>
				</div>
			</form>
			<div className="flex flex-col items-center gap-2">{children}</div>
		</div>
	);
}
