import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import { Package, Plus, Trash } from "lucide-react";
import { Control, Controller, FieldArray, FieldPath, FieldValues, useFieldArray } from "react-hook-form";

type CreateTimeEntry = {
  name: string;
  qty: number;
  unitPrice: number;
}

interface InvoiceCreateTimeEntriesProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export default function InvoiceCreateManualEntries<T extends FieldValues>({ control, name }: InvoiceCreateTimeEntriesProps<T>) {

  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  const addItem = () => {
    append({
      name: "",
      qty: 1,
      unitPrice: 0,
      timeEntryId: null,
    } as any);
  };

  const calculateItemTotal = (qty: number, unitPrice: number) => {
    return (qty * unitPrice).toFixed(2);
  };

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Invoice Items
          </div>
          <Button type="button" onClick={addItem} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items added yet</p>
            <p className="text-sm">Click "Add Item" to get started</p>
          </div>
        ) : (
          <>
            {/* Header row for desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
              <div className="col-span-4">Item Name</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2">Actions</div>
            </div>

            {fields.map((field, index) => (

              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Item Name */}
                <div className="md:col-span-4">
                  <FormField
                    control={control}
                    name={`${name}.${index}.name` as FieldPath<T>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="md:hidden">Item Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter item name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <FormField
                    control={control}
                    name={`${name}.${index}.qty` as FieldPath<T>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="md:hidden">Quantity</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="1"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Unit Price */}
                <div className="md:col-span-2">
                  <FormField
                    control={control}
                    name={`${name}.${index}.unitPrice` as FieldPath<T>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="md:hidden">Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    control={control}
                    name={`${name}.${index}.qty` as FieldPath<T>}
                    render={({ field: qtyField }) => (
                      <FormField
                        control={control}
                        name={`${name}.${index}.unitPrice` as FieldPath<T>}
                        render={({ field: priceField }) => (
                          <FormItem>
                            <FormLabel className="md:hidden">Total</FormLabel>
                            <div className="flex items-center h-10 px-3 py-2 border border-input bg-muted rounded-md text-sm font-medium">
                              {calculateItemTotal(qtyField.value || 0, priceField.value || 0)}
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                  />
                </div>

                <div className="md:col-span-2 h-full">
                  <FormLabel className="md:hidden">Actions</FormLabel>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="w-full h-full md:w-auto"
                  >
                    <Trash className="h-6 w-6" />
                  </Button>
                </div>
              </div>

            ))}
          </>
        )}
      </CardContent>
    </Card>);
}