import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface RegisterFormProps {
  onSubmit?: (data: FormData) => void;
  className?: React.ComponentProps<"div">["className"];
  children?: React.ComponentProps<"div">["children"];
}

const FormSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  password: z.string(),
});

type FormData = z.infer<typeof FormSchema>;

export function SignUpForm({
  className,
  onSubmit,
  children,
}: RegisterFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const onSubmitComponent = (e: FormData) => {
    onSubmit?.(e);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
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
                      <Input placeholder="shadcn" {...field} />
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
                      <Input placeholder="shadcn" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign up with Email
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="flex flex-col items-center gap-2">{children}</div>
    </div>
  );
}

export type SignUpAuthData = FormData;
