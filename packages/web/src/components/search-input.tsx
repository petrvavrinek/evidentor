import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Ref } from "react";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>;
};

/**
 * Input element with Search icon
 * @param props
 * @returns
 */
export default function SearchInput(props: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        {...props}
        placeholder={props.placeholder}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-[450px]",
          props.className
        )}
      />
    </div>
  );
}
