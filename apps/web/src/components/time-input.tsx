"use client";

import { type ChangeEvent, useEffect, useState, useRef } from "react";

import { Input } from "@evidentor/ui/components/ui/input";

export interface Time {
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
		value.minutes.toString().padStart(2, "0"),
	);
	
	// Track if we're currently editing to prevent external updates from interfering
	const isEditingHours = useRef(false);
	const isEditingMinutes = useRef(false);

	useEffect(() => {
		// Only update local state if we're not currently editing
		if (!isEditingHours.current) {
			setHours(value.hours.toString().padStart(2, "0"));
		}
		if (!isEditingMinutes.current) {
			setMinutes(value.minutes.toString().padStart(2, "0"));
		}
	}, [value]);

	const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		isEditingHours.current = true;
		
		// Allow empty input or 1-2 digits
		if (val === "" || /^\d{1,2}$/.test(val)) {
			setHours(val);
			
			if (val !== "") {
				let intVal = Number.parseInt(val, 10);
				if (intVal > 23) intVal = 23;
				
				onChange({ 
					hours: intVal, 
					minutes: Number.parseInt(minutes, 10) || 0 
				});
			}
		}
	};

	const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		isEditingMinutes.current = true;
		
		// Allow empty input or 1-2 digits
		if (val === "" || /^\d{1,2}$/.test(val)) {
			setMinutes(val);
			
			if (val !== "") {
				let intVal = Number.parseInt(val, 10);
				if (intVal > 59) intVal = 59;
				
				onChange({ 
					hours: Number.parseInt(hours, 10) || 0, 
					minutes: intVal 
				});
			}
		}
	};

	const handleHoursFocus = () => {
		isEditingHours.current = true;
	};

	const handleHoursBlur = () => {
		isEditingHours.current = false;
		
		if (hours === "") {
			setHours("00");
			onChange({ hours: 0, minutes: Number.parseInt(minutes, 10) || 0 });
		} else {
			const paddedHours = hours.padStart(2, "0");
			setHours(paddedHours);
		}
	};

	const handleMinutesFocus = () => {
		isEditingMinutes.current = true;
	};

	const handleMinutesBlur = () => {
		isEditingMinutes.current = false;
		
		if (minutes === "") {
			setMinutes("00");
			onChange({ hours: Number.parseInt(hours, 10) || 0, minutes: 0 });
		} else {
			const paddedMinutes = minutes.padStart(2, "0");
			setMinutes(paddedMinutes);
		}
	};

	return (
		<div className="flex items-center">
			<Input
				type="text"
				value={hours}
				onChange={handleHoursChange}
				onFocus={handleHoursFocus}
				onBlur={handleHoursBlur}
				className="w-16 text-center"
				maxLength={2}
			/>
			<span className="mx-1 text-lg">:</span>
			<Input
				type="text"
				value={minutes}
				onChange={handleMinutesChange}
				onFocus={handleMinutesFocus}
				onBlur={handleMinutesBlur}
				className="w-16 text-center"
				maxLength={2}
			/>
		</div>
	);
}