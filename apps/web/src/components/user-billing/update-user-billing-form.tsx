import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { zPutUserBillingData } from "@/lib/api/zod.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent } from "@evidentor/ui/components/ui/card";
import { Checkbox } from "@evidentor/ui/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import AddressForm from "../address/address-form";

const BillingSchema = zPutUserBillingData.shape.body;

interface UpdateUserBillingDialogProps {
  onUpdate?: (value: z.infer<typeof BillingSchema>) => void;
  initialData?: z.infer<typeof BillingSchema>
  
}

export default function UpdateUserBillingForm({ onUpdate, initialData }: UpdateUserBillingDialogProps) {

  const form = useForm({
    resolver: zodResolver(BillingSchema),
    defaultValues: initialData,
    shouldFocusError: true,
  });

  const handleSubmit = (data: z.infer<typeof BillingSchema>) => {
    onUpdate?.(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company ID {"(ICO)"}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          rules={{ required: false }}
          name="vatNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT number</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? undefined} required={false} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          rules={{ required: false }}
          name="vatPayer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is VAT payer?</FormLabel>
              <FormControl>
                <Checkbox checked={Boolean(field.value)} onCheckedChange={e => field.onChange(e)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank account</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardContent>
            <AddressForm control={form.control} name="address" />
          </CardContent>
        </Card>

        <Button type="submit">Save</Button>
      </form>
    </Form>

  )


}