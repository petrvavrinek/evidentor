import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH1 } from "@/components/ui/typography";
import app from "@/config/app";
import ContactConfig from "@/config/contact";

import "../../globals.css";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 antialiased">
				<div className="w-full max-w-md space-y-8">
					{/* Header */}
					<div className="text-center">
						<TypographyH1>
							<Link href={"/"}>{app.AppName}</Link>
						</TypographyH1>
						<p className="mt-2 text-gray-600">
							Sign in to access your dashboard
						</p>
					</div>

					{/* Form Container */}
					<Card className="shadow-lg">
						<CardContent className="pb-4">
							<Alert variant="destructive" className="mb-4">
								<AlertTitle>README BEFORE USE</AlertTitle>
								<AlertDescription>
									Keep in mind that this app should not be used for production
									work. <br />
									This app is still in development!
								</AlertDescription>
							</Alert>
							{children}
						</CardContent>
						{/* <CardFooter className="flex justify-center text-sm text-gray-500 pt-6">
							<div className="text-center">
								Protected by our{" "}
								<a href="/terms" className="underline hover:text-gray-700">
									Terms of Service
								</a>{" "}
								and{" "}
								<a href="/privacy" className="underline hover:text-gray-700">
									Privacy Policy
								</a>
							</div>
						</CardFooter> */}
					</Card>

					{/* Additional Info */}
					<div className="text-center text-sm text-gray-500">
						<p>
							Need help? Feel free to contact us at{" "}
							<Link href={`mailto:${ContactConfig.InfoMail}`}>
								{ContactConfig.InfoMail}
							</Link>
							.
						</p>
					</div>
				</div>
				{/* <div className="w-full max-w-sm">{children}</div> */}
			</body>
		</html>
	);
}
