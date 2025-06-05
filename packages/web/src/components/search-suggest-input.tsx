"use client";

import { Search } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import SearchInput from "./search-input";

interface SearchSuggestionResult {
  id: string | number;
  text: string;
  subtext?: string;
}

interface SearchSuggestProps {
  onChange?: (value: string) => void;
  suggest: (value: string) => Promise<SearchSuggestionResult[]>;
  onSuggestSelect?: (suggestion: SearchSuggestionResult) => void;
  placeholder?: string;
}

/**
 * Search component that allows suggestions
 * @param props
 * @returns
 */
export default function SearchSuggest(props: SearchSuggestProps) {
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestionResult[]>([]);
  const [opened, setOpened] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length === 0) {
      setSuggestions([]);
      setOpened(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOpened(true);
    setSelectedIndex(-1);

    props.suggest(debouncedSearchTerm).then((results) => {
      setSuggestions(results);
      setLoading(false);

      if (results.length === 0) {
        setOpened(false);
      }
    });
  }, [debouncedSearchTerm, props]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setSearchTerm(newValue);
    props.onChange?.(newValue);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestionResult) => {
    setValue(suggestion.text);
    setSuggestions([]);
    setOpened(false);
    props.onSuggestSelect?.(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!opened || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setOpened(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const shouldShowPopover = opened && (loading || suggestions.length > 0);

  return (
    <Popover open={shouldShowPopover} onOpenChange={setOpened}>
      <PopoverTrigger>
        <SearchInput
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder}
        />
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
                <div
                  key={suggestion.id}
                  className={`px-2.5 py-2.5 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground border-b border-border/50 last:border-b-0 ${
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onMouseLeave={() => setSelectedIndex(-1)}
                >
                  <div className="font-medium text-sm">{suggestion.text}</div>
                  {suggestion.subtext && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {suggestion.subtext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
