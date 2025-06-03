import "../globals.css";

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 antialiased">
        <div className="w-full max-w-sm">{children}</div>
      </body>
    </html>
  );
}
