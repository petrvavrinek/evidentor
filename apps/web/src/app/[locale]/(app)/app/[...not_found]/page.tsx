import Link from "next/link";

import { Button } from "@evidentor/ui/components/ui/button";
import { TypographyH2 } from "@evidentor/ui/components/ui/typography";

export default function AppNotFoundPage() {
	return (
		<div className="flex flex-col h-full justify-center items-center">
			<TypographyH2 className="h-fit">Oops... page not found</TypographyH2>

			<Link href="/app">
				<Button>Go back to dashbard</Button>
			</Link>
		</div>
	);
}
