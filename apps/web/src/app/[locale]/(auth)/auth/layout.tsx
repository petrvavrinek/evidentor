import Link from "next/link";

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@evidentor/ui/components/ui/alert";
import { Card, CardContent } from "@evidentor/ui/components/ui/card";
import { TypographyH1 } from "@evidentor/ui/components/ui/typography";

import app from "@/config/app";
import ContactConfig from "@/config/contact";

import "../../globals.css";
import { useTranslations } from "next-intl";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const t = useTranslations("auth");
	return (
		<body className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 antialiased">
			<div className="w-full max-w-md space-y-5">
				{/* Header */}
				<div className="text-center">
					<TypographyH1>
						<Link href={"/"}>{app.AppName}</Link>
					</TypographyH1>
					<p className="mt-2 text-gray-600">
						{t("subtitle")}
					</p>
				</div>

				{/* Form Container */}
				<Card className="shadow-lg">
					<CardContent className="pb-4">
						<Alert variant="destructive" className="mb-4">
							<AlertTitle className="font-bold">{t("alerts.dev.title")}</AlertTitle>
							<AlertDescription>{t("alerts.dev.message")}
							</AlertDescription>
						</Alert>
						{children}
					</CardContent>
				</Card>

				{/* Additional Info */}
				<div className="text-center text-sm text-gray-500">
					<p>
						{t("footer.help") + ": "}
						<Link href={`mailto:${ContactConfig.InfoMail}`}>
							{ContactConfig.InfoMail}
						</Link>
						.
					</p>
				</div>
			</div>
			{/* <div className="w-full max-w-sm">{children}</div> */}
		</body>
	);
}
