"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getBreadcrumbPath } from "@/config/app-routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@evidentor/ui/components/ui/breadcrumb";

interface DynamicBreadcrumbProps {
  variant?: "default" | "subtle" | "prominent" | "card" | "pill";
  size?: "sm" | "default" | "lg";
  linkVariant?: "default" | "button" | "ghost" | "underline";
  separatorVariant?: "chevron" | "slash" | "dot" | "arrow";
  showHomeIcon?: boolean;
  maxItems?: number;
}

export function DynamicBreadcrumb({
  variant = "default",
  size = "default",
  linkVariant = "button",
  separatorVariant = "chevron",
  showHomeIcon = true,
  maxItems,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // Don't show breadcrumbs on root app page
  if (pathname === "/app") {
    return null;
  }

  // Get breadcrumb items from route config (hidden routes are already filtered in getBreadcrumbPath)
  let breadcrumbItems = getBreadcrumbPath(pathname);

  breadcrumbItems.unshift({
    href: "/app",
    id: "app",
    name: "Dashboard",
    icon: LayoutDashboard,
  });

  // If no breadcrumb items are found (possibly all hidden), don't render anything
  if (breadcrumbItems.length === 0) {
    return null;
  }

  // Handle max items with ellipsis
  if (maxItems && breadcrumbItems.length > maxItems) {
    const firstItem = breadcrumbItems[0];
    const lastItems = breadcrumbItems.slice(-maxItems + 1);

    breadcrumbItems = [
      firstItem,
      // @typescript-eslint/ban-ts-comment
      { id: "ellipsis", name: "...", href: "#", items: [], },
      ...lastItems,
    ];
  }

  return (
    <div className="mb-6">
      <Breadcrumb variant={variant} size={size}>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isEllipsis = item.id === "ellipsis";

            if (isEllipsis) {
              return (
                <div key="ellipsis" className="flex items-center">
                  <BreadcrumbSeparator variant={separatorVariant} />
                  <BreadcrumbItem>
                    <span className="px-2 py-1 text-muted-foreground">...</span>
                  </BreadcrumbItem>
                </div>
              );
            }

            if (!("href" in item) && isLast) {
              // This is a parent item with no direct href but is the last item
              return (
                <div key={item.id} className="flex items-center">
                  {index > 0 && (
                    <BreadcrumbSeparator variant={separatorVariant} />
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </div>
              );
            }

            return (
              <div
                key={"href" in item ? item.href : item.id}
                className="flex items-center"
              >
                {index > 0 && (
                  <BreadcrumbSeparator variant={separatorVariant} />
                )}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild variant={linkVariant}>
                      <Link
                        href={"href" in item ? item.href : "#"}
                        className="group"
                      >
                        <div className="flex items-center gap-1.5">
                          {index === 0 && showHomeIcon && item.icon && (
                            <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
