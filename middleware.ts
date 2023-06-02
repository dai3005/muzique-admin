import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const appUrl = new URL(process.env.NEXT_PUBLIC_BE_URL ?? '');

  if (request.nextUrl.host !== appUrl.host) {
    const newUrl = request.nextUrl.clone();

    newUrl.host = appUrl.host;

    newUrl.port = appUrl.port;

    newUrl.protocol = appUrl.protocol;

    newUrl.pathname = newUrl.pathname.replace('/api', '');

    return NextResponse.rewrite(newUrl);
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/api/:path*'
};
