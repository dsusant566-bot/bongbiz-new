import { NextResponse } from 'next/server';

export function middleware(request) {
  // সব ধরণের সম্ভাব্য সেশন টোকেন চেক করা হচ্ছে (Supabase + NextAuth)
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token') ||
                request.cookies.get('sb-access-token');
  
  const { pathname } = request.nextUrl;

  // যে পেজগুলো আমরা লক করতে চাই
  const protectedPaths = ['/dashboard', '/admin', '/post-ad', '/lead'];

  // যদি ইউজার লক করা পেজে যেতে চায় কিন্তু লগইন করা না থাকে
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      // তাকে হোমপেজে পাঠিয়ে দাও
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

// এই কনফিগটি মাস্ট লাগবে, যা বলে দেয় কোন কোন পথে নজর রাখতে হবে
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/post-ad', 
    '/lead/:path*'
  ],
};