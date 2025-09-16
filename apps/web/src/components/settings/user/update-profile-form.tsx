import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@evidentor/ui/components/ui/avatar";
import { Button } from "@evidentor/ui/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  name: z.string().optional(),
  email: z.string(),
  avatar: z.string().optional()
});

interface UpdateProfileFormProps {
  initialData?: z.infer<typeof FormSchema>,
  onUpdate?: (value: z.infer<typeof FormSchema>) => void;
}

export default function UpdateProfileForm({ initialData, onUpdate }: UpdateProfileFormProps) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData,
  })

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    onUpdate?.(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <Avatar id="avatar" className="w-50 h-50 p-4 cursor-pointer">
                <AvatarImage src={field.value ?? ""} />
                <AvatarFallback>
                  <Upload />
                </AvatarFallback>
              </Avatar>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )



}