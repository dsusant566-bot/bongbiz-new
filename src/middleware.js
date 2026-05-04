import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const adminEmail = "dsusant566@gmail.com";

  // যদি ইউজার লগইন না থাকে এবং সে সরাসরি পোস্ট-অ্যাড পেজে যেতে চায়
  if (pathname.startsWith('/post-ad') && !token) {
    // লগইন করার পর সরাসরি তাকে পোস্ট-অ্যাড পেজেই পাঠাতে বাধ্য করা হবে
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // অ্যাডমিন পাথ সুরক্ষা
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!token || token.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/post-ad', '/dashboard/:path*', '/admin/:path*'],
};