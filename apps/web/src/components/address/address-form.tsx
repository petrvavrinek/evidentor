import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface AddressFormProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export default function AddressForm<T extends FieldValues>({ control, name }: AddressFormProps<T>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <FormField
        control={control}
        name={`${name}.streetLine1` as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.streetLine2` as FieldPath<T>}
        rules={{ required: false }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street name 2</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? undefined} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={control}
        name={`${name}.city` as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={control}
        name={`${name}.postalCode` as FieldPath<T>}
        rules={{ required: false }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal code</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? undefined} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${name}.state` as FieldPath<T>}
        rules={{ required: false }}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? undefined} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${name}.country` as FieldPath<T>}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}