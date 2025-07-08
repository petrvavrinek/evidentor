import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  onSubmit?: (fullName: string, email: string, password: string) => void;
  className?: React.ComponentProps<"div">["className"];
  children?: React.ComponentProps<"div">["children"];
}

export function RegisterForm({
  className,
  onSubmit,
  children,
}: RegisterFormProps) {
  const onAction = (e: FormData) => {
    onSubmit?.(
      e.get("fullName")?.toString() ?? "",
      e.get("email")?.toString() ?? "",
      e.get("password")?.toString() ?? ""
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form action={onAction}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>

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
              <Label htmlFor="email">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign up with Email
            </Button>
          </div>
        </div>
      </form>
      <div className="flex flex-col items-center gap-2">{children}</div>
    </div>
  );
}
