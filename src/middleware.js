import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const adminEmail = "dsusant566@gmail.com";

  // ১. সুরক্ষিত পাথগুলোর তালিকা
  const protectedPaths = ['/dashboard', '/post-ad', '/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  // ২. যদি লগইন না থাকে এবং প্রটেক্টেড পাথে যেতে চায়, তবে তাকে আটকে দাও
  if (isProtected && !token) {
    // এখানে রিডাইরেক্ট করার সময় কোনো callbackUrl জোর করে ড্যাশবোর্ডে পাঠাবেন না
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ৩. অ্যাডমিন পাথে শুধু আপনার ইমেল আইডি ভেরিফিকেশন
  if (isAdminPath) {
    if (token && token.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // ৪. লগইন করার পর অটোমেটিক ড্যাশবোর্ডে পাঠানোর কোনো কোড এখানে রাখা যাবে না
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