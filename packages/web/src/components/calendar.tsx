"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDayNames, getMonthNames } from "@/lib/dates";

interface CalendarProps {
  date: Date;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({ date, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear());
  const monthNames = getMonthNames("long");
  const dayNames = getDayNames("short");

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === date.getDate() &&
      currentMonth === date.getMonth() &&
      currentYear === date.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect(newDate);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-20 md:h-24"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayEvents = [];

          return (
            <button
              key={day}
              className={cn(
                "h-20 md:h-24 p-1 border rounded-lg hover:bg-muted/50 transition-colors flex flex-col",
                isToday(day) && "bg-primary/10 border-primary",
                isSelected(day) && "bg-primary/30 border-primary",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              onClick={() => handleDateClick(day)}
            >
              <span
                className={cn(
                  "text-sm font-medium mb-1",
                  isToday(day) && "text-primary font-bold"
                )}
              >
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
