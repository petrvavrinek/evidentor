import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, useMemo } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type TimeInputProps = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "value" | "type" | "onChange"> &
{
  value?: Date,
  onChange?: (newDate: Date) => void;
}

export function TimeInput(props: TimeInputProps) {
  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [hours, minutes, seconds] = value.split(":");

    const date = new Date();
    date.setHours(Number.parseInt(hours));
    date.setMinutes(Number.parseInt(minutes));
    date.setSeconds(Number.parseInt(seconds));
    date.setMilliseconds(0);
    props.onChange?.(date);
  }

  const timeToValue = (t: number) => t.toString().padStart(2, '0');
  const valueStr = useMemo(() => props.value ? `${timeToValue(props.value.getHours())}:${timeToValue(props.value.getMinutes())}:${timeToValue(props.value.getSeconds())}` : undefined, [props.value]);

  return (
    <Input
      type="time"
      value={valueStr}
      onChange={onValueChange}
      name={props.name}
      step={props.step ?? "1"}
      defaultValue={props.defaultValue}
      className={cn("bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none", props.className)}
    />
  )

}