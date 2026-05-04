import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const adminEmail = "dsusant566@gmail.com";

  const protectedPaths = ['/dashboard', '/post-ad', '/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  if (isAdminPath) {
    if (token && token.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/admin-control/:path*', 
    '/admin-leads/:path*',
    '/admin-enquiries/:path*',
    '/post-ad'
  ],
};