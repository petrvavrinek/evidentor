"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import SearchSuggest, {
	type SearchSuggestionResult,
} from "@/components/search-suggest-input";

import { getClients } from "@/lib/api";
import { getClientsQueryKey } from "@/lib/api/@tanstack/react-query.gen";

interface ClientSelectProps {
	value: number | null;
	onChange: (value: number | null) => void;
}

export default function ClientSelect({ value, onChange }: ClientSelectProps) {
	const { data: clients } = useQuery({
		queryKey: getClientsQueryKey(),
		queryFn: () => getClients(),
	});

	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		const selectedClient = clients?.data?.find((c) => c.id === value);
		setInputValue(selectedClient?.companyName || "");
	}, [value, clients]);

	const handleSuggest = async (query: string) => {
		if (!query) return [];
		const filteredClients =
			clients?.data?.filter((client) =>
				client.companyName.toLowerCase().includes(query.toLowerCase()),
			) ?? [];

		return filteredClients.map((client) => ({
			id: client.id,
			text: client.companyName,
		}));
	};

	const handleInputChange = (
		currentValue: string,
		suggestion?: SearchSuggestionResult,
	) => {
		setInputValue(currentValue);
		if (currentValue === "") {
			onChange(null);
		}

		if (suggestion) onChange(suggestion.id as number);
	};

	return (
		<SearchSuggest
			value={inputValue}
			onValueChange={handleInputChange}
			suggest={handleSuggest}
			placeholder="Search for a client..."
		/>
	);
}
