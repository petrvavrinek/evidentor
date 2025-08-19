import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange?: (newDate: Date) => void;
  title?: string;
  formatDate: (date: Date) => string;
  required?: boolean;
  className?: string;
}

export default function DatePicker({ onChange, value, formatDate, title, required, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={cn("data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal", className)}
        >
          <CalendarIcon />
          {value ? formatDate(value) : <span>{title}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={(e: any) => {
          onChange?.(e);
          setOpen(false);
        }} required={required} />
      </PopoverContent>
    </Popover>
  );
}