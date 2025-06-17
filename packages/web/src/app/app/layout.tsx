"use client";

import dynamic from "next/dynamic";
import ClientLayout from "./client-layout";

import "../globals.css";

const NoSSRWrapper = dynamic(
  () => Promise.resolve(({ children }: any) => <>{children}</>),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="aliased">
        <NoSSRWrapper>
          <ClientLayout>{children}</ClientLayout>
        </NoSSRWrapper>
      </body>
    </html>
  );
}
