"use client";

import ClientLayout from "./client-layout";
import "../../globals.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="aliased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
