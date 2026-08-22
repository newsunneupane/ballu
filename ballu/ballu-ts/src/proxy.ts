import { NextRequest, NextResponse } from 'next/server';

const COUNTRY_COOKIE = 'bj_country';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  if (req.cookies.get(COUNTRY_COOKIE)) {
    return res;
  }

  const country = req.headers.get('x-vercel-ip-country');

  res.cookies.set(COUNTRY_COOKIE, country || 'NP', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}

export const config = {
  matcher: '/((?!_next|api|favicon.ico).*)',
};
