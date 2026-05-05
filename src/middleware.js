import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const adminEmail = "dsusant566@gmail.com";
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];

  if (adminPaths.some(path => pathname.startsWith(path))) {
    // যদি টোকেন না থাকে বা ইমেল না মিলে তবে হোম পেজে রিডাইরেক্ট
    if (!token || token.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin-control/:path*', '/admin-leads/:path*', '/admin-enquiries/:path*'],
};