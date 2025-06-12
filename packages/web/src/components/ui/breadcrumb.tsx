import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal, Slash } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const breadcrumbVariants = cva(
  "flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        subtle: "text-muted-foreground/70",
        prominent: "text-foreground/80",
        card: "bg-muted/30 rounded-lg px-3 py-2 text-muted-foreground",
        pill: "bg-background border rounded-full px-4 py-2 text-muted-foreground shadow-sm",
      },
      size: {
        sm: "text-xs gap-1 sm:gap-1.5",
        default: "text-sm gap-1.5 sm:gap-2.5",
        lg: "text-base gap-2 sm:gap-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> &
    VariantProps<typeof breadcrumbVariants> & {
      separator?: React.ComponentType<{ className?: string }>;
    }
>(({ className, variant, size, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="breadcrumb"
    className={cn(breadcrumbVariants({ variant, size }), className)}
    {...props}
  />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("flex flex-wrap items-center", className)}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const breadcrumbLinkVariants = cva(
  "inline-flex items-center gap-1.5 transition-all duration-200 rounded-md",
  {
    variants: {
      variant: {
        default: "hover:text-foreground hover:underline underline-offset-4",
        button: "px-2 py-1 hover:bg-accent hover:text-accent-foreground",
        ghost: "px-2 py-1 hover:bg-muted hover:text-foreground",
        underline:
          "hover:text-foreground hover:underline underline-offset-2 decoration-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> &
    VariantProps<typeof breadcrumbLinkVariants> & {
      asChild?: boolean;
    }
>(({ asChild, className, variant, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn(breadcrumbLinkVariants({ variant }), className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-medium text-foreground px-2 py-1", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const breadcrumbSeparatorVariants = cva(
  "flex items-center justify-center transition-colors duration-200",
  {
    variants: {
      variant: {
        chevron: "[&>svg]:size-4 text-muted-foreground/60",
        slash: "[&>svg]:size-4 text-muted-foreground/60",
        dot: "w-1 h-1 bg-muted-foreground/60 rounded-full mx-2",
        arrow: "[&>svg]:size-4 text-muted-foreground/60",
      },
    },
    defaultVariants: {
      variant: "chevron",
    },
  }
);

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & VariantProps<typeof breadcrumbSeparatorVariants>
>(({ children, className, variant, ...props }, ref) => (
  <li
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn(breadcrumbSeparatorVariants({ variant }), className)}
    {...props}
  >
    {children ??
      (variant === "slash" ? (
        <Slash />
      ) : variant === "dot" ? null : (
        <ChevronRight />
      ))}
  </li>
));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors duration-200",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
));
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  breadcrumbVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
};
