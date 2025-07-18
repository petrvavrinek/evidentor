interface AmountProps {
	currency: string;
	amount: number;
	language: string;
}

export default function CurrencyAmount({ amount, currency, language }: AmountProps) {
	const { format } = new Intl.NumberFormat(language, {
		style: "currency",
		currency,
	});
	return format(amount);
}
