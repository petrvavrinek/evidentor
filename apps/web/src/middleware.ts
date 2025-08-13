import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales } from './app/translations';
/**
 * Return locale based on request headers
 * @param request Request
 * @returns Locale
 */
function getLocale(request: NextRequest): string {
  const headers = Object.fromEntries(request.headers.entries());
  const languages = new Negotiator({ headers });
  return match(languages.languages(), locales, defaultLocale)
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
  if(pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)'
  ]
}