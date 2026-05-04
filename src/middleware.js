import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // ১. সেশন টোকেন নেওয়া (NextAuth Secret ব্যবহার করে)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // বিকল্পভাবে কুকি থেকে সুপাবেস টোকেন চেক (যদি প্রয়োজন হয়)
  const supabaseToken = req.cookies.get('sb-access-token');
  
  const { pathname } = req.nextUrl;

  // আপনার ফিক্সড অ্যাডমিন ইমেল আইডি
  const adminEmail = "dsusant566@gmail.com";

  // সুরক্ষিত পাথ
  const protectedPaths = ['/dashboard', '/post-ad', '/admin', '/admin-control'];
  const adminPaths = ['/admin', '/admin-control'];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  // কন্ডিশন ১: লগইন না থাকলে সুরক্ষিত পাথে ঢুকতে বাধা
  if (isProtected && !token && !supabaseToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // কন্ডিশন ২: অ্যাডমিন পাথে শুধু আপনার (dsusant566) জন্য এক্সেস
  if (isAdminPath) {
    // যদি টোকেন থাকে কিন্তু ইমেল না মেলে
    if (token && token.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // যদি কোনোভাবে টোকেন না থাকে (কিন্তু আপনি পাথ হিট করেছেন)
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
    '/post-ad'
  ],
};