import { NextRequest, NextResponse } from 'next/server';

const COUNTRY_COOKIE = 'bj_country';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.cookies.get(COUNTRY_COOKIE)) {
    return res;
  }

  let country = req.headers.get('x-vercel-ip-country');

  if (!country) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (ip) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
          signal: AbortSignal.timeout(1500),
        });
        if (geoRes.ok) {
          const data = await geoRes.json();
          country = data?.countryCode || null;
        }
      } catch {
        country = null;
      }
    }
  }

  res.cookies.set(COUNTRY_COOKIE, country || 'NP', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
};
