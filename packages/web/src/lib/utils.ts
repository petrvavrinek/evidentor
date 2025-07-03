import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// A little bit simplified version
export const groupBy = <T, K extends string | number | symbol>(arr: T[], key: (item: T) => K): Record<K, T[]> => {
	return arr.reduce(
		(groups, item) => {
			const groupKey = key(item);
			if (!groups[groupKey]) {
				groups[groupKey] = [];
			}
			groups[groupKey].push(item);
			return groups;
		},
		{} as Record<K, T[]>,
	);
};
