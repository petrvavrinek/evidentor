"use client";

import PageHeader from "@/components/page-header";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TypographyH3 } from "@/components/ui/typography";

import { Sun, Moon } from "lucide-react";

export default function PageAppearance() {
  const handleThemeChange = (value: "dark" | "light") => {
    document.documentElement.classList.toggle("dark", value === "dark");
  };
  return (
    <>
      <PageHeader
        title="Appearance settings"
        subtitle="Customize the look and feel of the application"
      />

      <div className="space-y-4">
        <TypographyH3>Theme</TypographyH3>

        <RadioGroup
          className="grid grid-cols-2 gap-4"
          onValueChange={handleThemeChange}
        >
          <div>
            <RadioGroupItem value="light" id="light" className="sr-only peer" />
            <Label
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Sun className="mb-3 h-6 w-6" />
              Light Mode
            </Label>
          </div>
          <div>
            <RadioGroupItem value="dark" id="dark" className="sr-only peer" />
            <Label
              htmlFor="dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Moon className="mb-3 h-6 w-6" />
              Dark Mode
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
}
