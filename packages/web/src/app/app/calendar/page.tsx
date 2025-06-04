"use client";

import Calendar from "@/components/calendar";
import { useState } from "react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return <Calendar date={currentDate} onDateSelect={setCurrentDate} />;
}
