"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@evidentor/ui/components/ui/popover";

import SearchInput from "./search-input";

export interface SearchSuggestionResult {
	id: string | number;
	text: string;
	subtext?: string;
}

interface SearchSuggestProps {
	value: string;
	onValueChange: (value: string, suggestion?: SearchSuggestionResult) => void;
	suggest: (value: string) => Promise<SearchSuggestionResult[]>;
	placeholder?: string;
	disabled?: boolean;
}

export default function SearchSuggest({
	onValueChange,
	suggest,
	value,
	placeholder,
}: SearchSuggestProps) {
	const [suggestions, setSuggestions] = useState<SearchSuggestionResult[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedSuggestion, setSelectedSuggestion] =
		useState<SearchSuggestionResult | null>(null);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const fetchSuggestions = async () => {
			if (!value.trim()) {
				setSuggestions([]);
				setShowSuggestions(false);
				return;
			}

			// Don't show suggestions if user has already selected one
			if (hasSelectedSuggestion) {
				return;
			}

			setLoading(true);
			try {
				const results = await suggest(value);
				setSuggestions(results);
				setShowSuggestions(true);
				setHighlightedIndex(-1);
			} catch (error) {
				console.error("Error fetching suggestions:", error);
				setSuggestions([]);
			} finally {
				setLoading(false);
			}
		};

		const debounceTimer = setTimeout(fetchSuggestions, 300);
		return () => clearTimeout(debounceTimer);
	}, [value, suggest, hasSelectedSuggestion]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		onValueChange(newValue);

		// Reset selected suggestion and allow suggestions to show again
		if (selectedSuggestion) {
			setSelectedSuggestion(null);
			setHasSelectedSuggestion(false);
		}
	};

	const handleSuggestionClick = (suggestion: SearchSuggestionResult) => {
		setSelectedSuggestion(suggestion);
		setHasSelectedSuggestion(true);
		onValueChange(suggestion.text, suggestion);
		setShowSuggestions(false);
		inputRef.current?.blur();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showSuggestions) return;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setHighlightedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : prev,
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case "Enter":
				e.preventDefault();
				if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
					handleSuggestionClick(suggestions[highlightedIndex]);
				}
				break;
			case "Escape":
				setShowSuggestions(false);
				setHighlightedIndex(-1);
				break;
		}
	};

	return (
		<Popover open={showSuggestions && suggestions.length > 0}>
			<PopoverTrigger asChild>
				<div>
					<SearchInput
						ref={inputRef}
						value={value}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
					/>
				</div>
			</PopoverTrigger>

			<PopoverContent
				className="w-[var(--radix-popover-trigger-width)] p-0"
				align="start"
				sideOffset={4}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className="max-h-[300px] overflow-y-auto">
					{loading && (
						<div className="flex items-center justify-center p-8">
							<div className="relative">
								<div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
								<div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-primary/40 rounded-full animate-spin animation-delay-150"></div>
							</div>
						</div>
					)}

					{!loading && suggestions.length > 0 && (
						<div>
							{suggestions.map((suggestion, index) => (
								<button
									type="button"
									key={suggestion.id}
									className={`px-2.5 py-2.5 block w-full text-left cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground border-b border-border/50 last:border-b-0 ${
										highlightedIndex === index
											? "bg-accent text-accent-foreground"
											: ""
									}`}
									onClick={() => handleSuggestionClick(suggestion)}
								>
									<div className="font-medium text-sm">{suggestion.text}</div>
									{suggestion.subtext && (
										<div className="text-xs text-muted-foreground mt-1">
											{suggestion.subtext}
										</div>
									)}
								</button>
							))}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
