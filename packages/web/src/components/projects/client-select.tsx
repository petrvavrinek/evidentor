"use client";

import SearchSuggest from "@/components/search-suggest-input";
import { getClient } from "@/lib/api";
import { getClientQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ClientSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function ClientSelect({ value, onChange }: ClientSelectProps) {
  const { data: clients = [] } = useQuery({
    queryKey: getClientQueryKey(),
    queryFn: async () => {
      const { data, error } = await getClient({});
      if (error) {
        console.error("Failed to fetch clients:", error);
        return [];
      }
      return data ?? [];
    },
  });

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const selectedClient = clients.find((c) => c.id === value);
    setInputValue(selectedClient?.companyName || "");
  }, [value, clients]);

  const handleSuggest = async (query: string) => {
    if (!query) return [];
    const filteredClients = clients.filter((client) =>
      client.companyName.toLowerCase().includes(query.toLowerCase())
    );
    return filteredClients.map((client) => ({
      id: client.id,
      text: client.companyName,
    }));
  };

  const handleSelect = (suggestion: { id: string | number; text: string }) => {
    onChange(suggestion.id as number);
    setInputValue(suggestion.text);
  };

  const handleInputChange = (currentValue: string) => {
    setInputValue(currentValue);
    if (currentValue === "") {
      onChange(null);
    }
  };

  return (
    <SearchSuggest
      value={inputValue}
      onValueChange={handleInputChange}
      suggest={handleSuggest}
      onSuggestSelect={handleSelect}
      placeholder="Search for a client..."
    />
  );
}
