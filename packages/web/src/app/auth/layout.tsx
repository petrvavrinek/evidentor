import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import app from "@/config/app";
import "../globals.css";

export default function AuthRootLayout({
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
            <h1 className="text-3xl font-bold text-gray-900">{app.AppName}</h1>
            <p className="mt-2 text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form Container */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">{children}</CardHeader>
            <CardFooter className="flex justify-center text-sm text-gray-500 pt-6">
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
            </CardFooter>
          </Card>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact us at support@example.com</p>
          </div>
        </div>
        {/* <div className="w-full max-w-sm">{children}</div> */}
      </body>
    </html>
  );
}
