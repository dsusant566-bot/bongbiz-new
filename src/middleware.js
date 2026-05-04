import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const supabaseToken = req.cookies.get('sb-access-token');
  const { pathname } = req.nextUrl;

  const adminEmail = "dsusant566@gmail.com";

  // সুরক্ষিত পাথগুলোর তালিকা
  const protectedPaths = ['/dashboard', '/post-ad', '/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  // কন্ডিশন ১: লগইন না থাকলে প্রটেক্টেড পাথে বাধা
  if (isProtected && !token && !supabaseToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // কন্ডিশন ২: অ্যাডমিন পাথে শুধু আপনার ইমেল আইডি ভেরিফিকেশন
  if (isAdminPath) {
    if (token && token.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (!token) {
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