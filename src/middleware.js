import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // আপনার পুরনো পেজগুলোর মতো এখানেও getToken ব্যবহার করা হয়েছে
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const adminEmail = "dsusant566@gmail.com";

  // যে পাথগুলো আমরা লক করতে চাই
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];

  // যদি কেউ এই ৪টি পাথের কোনোটিতে ঢোকার চেষ্টা করে
  if (adminPaths.some(path => pathname.startsWith(path))) {
    // যদি সে লগইন না থাকে অথবা তার ইমেইল আপনার মেইল না হয়
    if (!token || token.email !== adminEmail) {
      // তাকে সরাসরি হোম পেজে পাঠিয়ে দাও
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

// এই কনফিগ নিশ্চিত করবে যে শুধু নির্দিষ্ট পাথেই মিডলওয়্যার কাজ করবে
export const config = {
  matcher: [
    '/admin/:path*', 
    '/admin-control/:path*', 
    '/admin-leads/:path*', 
    '/admin-enquiries/:path*'
  ],
};