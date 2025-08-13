import { ReactNode } from 'react';
import { locales } from '../translations';

export async function generateStaticParams() {
  return locales.map(lang => ({ lang }));
}

interface RootLayoutProps {
  children: ReactNode,
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params}: RootLayoutProps) {
  const lang = (await params).lang;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}