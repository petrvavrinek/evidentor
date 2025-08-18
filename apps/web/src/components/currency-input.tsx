import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@evidentor/ui/components/ui/select";

interface CurrencyInputProps {
  value?: string;
  onChange?: (newValue: string) => void;
  className?: string;
}

export default function CurrencyInput({ className, onChange, value }: CurrencyInputProps) {
  return (
    <Select onValueChange={e => onChange?.(e as never)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="czk">CZK</SelectItem>
        <SelectItem value="eur">EUR</SelectItem>
      </SelectContent>
    </Select>
  )
}