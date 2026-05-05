import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const adminEmail = "dsusant566@gmail.com";

  // ১. পোস্ট-অ্যাড পেজ সুরক্ষা (আগের মতোই)
  if (pathname.startsWith('/post-ad') && !token) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ২. অ্যাডমিন পাথ সুরক্ষা (আপনার অরিজিনাল কড়া সিকিউরিটি)
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!token || token.email !== adminEmail) {
      // আপনার জিমেইল না হলে সোজা হোম পেজে রিডাইরেক্ট
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // ড্যাশবোর্ড এখান থেকে সরানো হয়েছে যাতে সুপাবেজ সেশনে বাধা না পড়ে
  // কিন্তু অ্যাডমিন এবং পোস্ট-অ্যাড আগের মতোই মিডলওয়্যার দিয়ে সুরক্ষিত
  matcher: ['/post-ad', '/admin/:path*', '/admin-control/:path*', '/admin-leads/:path*', '/admin-enquiries/:path*'],
};