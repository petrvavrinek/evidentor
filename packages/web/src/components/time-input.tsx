"use client";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";

interface Time {
  hours: number;
  minutes: number;
}

interface TimeInputProps {
  value: Time;
  onChange: (newTime: Time) => void;
}

export function TimeInput({ value, onChange }: TimeInputProps) {
  const [hours, setHours] = useState(value.hours.toString().padStart(2, "0"));
  const [minutes, setMinutes] = useState(
    value.minutes.toString().padStart(2, "0")
  );

  useEffect(() => {
    setHours(value.hours.toString().padStart(2, "0"));
    setMinutes(value.minutes.toString().padStart(2, "0"));
  }, [value]);

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val === "") {
      setHours("");
      return;
    }

    let intVal = Number.parseInt(val, 10);
    if (isNaN(intVal)) return;

    if (intVal < 0) intVal = 0;
    if (intVal > 23) intVal = 23;

    setHours(val.toString().padStart(2, "0"));
    onChange({ hours: intVal, minutes: Number.parseInt(minutes, 10) });
  };

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val === "") {
      setMinutes("");
      return;
    }

    let intVal = Number.parseInt(val, 10);
    if (isNaN(intVal)) return;

    if (intVal < 0) intVal = 0;
    if (intVal > 59) intVal = 59;

    setMinutes(val.toString().padStart(2, "0"));
    onChange({ hours: Number.parseInt(hours, 10), minutes: intVal });
  };

  return (
    <div className="flex items-center">
      <Input
        type="text"
        value={hours}
        onChange={handleHoursChange}
        className="w-16 text-center"
        maxLength={2}
      />
      <span className="mx-1 text-lg">:</span>
      <Input
        type="text"
        value={minutes}
        onChange={handleMinutesChange}
        className="w-16 text-center"
        maxLength={2}
      />
    </div>
  );
}
