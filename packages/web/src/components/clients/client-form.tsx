"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import LoadableButton from "../ui/loadable-button";

const FormSchema = z.object({
  companyName: z.string(),
  contactName: z.string(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
});

type FormData = z.infer<typeof FormSchema>;

interface ClientFormProps {
  onCancel?: () => void;
  onSubmit?: (client: FormData) => void;
  client?: FormData;
  loading?: boolean;
}

export function ClientForm({
  onCancel,
  onSubmit,
  client,
  loading,
}: ClientFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: client,
  });

  const onSubmitComponent = async (e: FormData) => {
    onSubmit?.(e);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitComponent)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              rules={{ required: false }}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      value={field.value ?? ""}
                      required={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="phone"
              rules={{ required: false }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      required={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="address"
            rules={{ required: false }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <LoadableButton loading={loading} type="submit">
            Save Client
          </LoadableButton>
        </div>
      </form>
    </Form>
  );
}
