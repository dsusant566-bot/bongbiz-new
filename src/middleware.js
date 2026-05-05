import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const adminEmail = "dsusant566@gmail.com";

  // কাস্টমার ড্যাশবোর্ড ও পোস্ট-অ্যাড পেজ আমরা পেজের ভেতর (Client-side) হ্যান্ডেল করব
  // তাই এখান থেকে রিডাইরেক্ট লজিক সরিয়ে দেওয়া হলো যাতে সেশন কনফ্লিক্ট না হয়।

  // শুধুমাত্র অ্যাডমিন পাথ সুরক্ষা (এটি আগের মতোই আপনার জন্য সুরক্ষিত থাকবে)
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!token || token.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // matcher থেকে ড্যাশবোর্ড সরিয়ে দিন যাতে সুপাবেজ সেশন কাজ করতে পারে
  matcher: ['/admin/:path*', '/admin-control/:path*', '/admin-leads/:path*', '/admin-enquiries/:path*'],
};