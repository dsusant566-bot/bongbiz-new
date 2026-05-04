import { NextResponse } from 'next/server';

export function middleware(request) {
  // টোকেন চেক করা (Supabase + NextAuth)
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token') ||
                request.cookies.get('sb-access-token');
  
  const { pathname } = request.nextUrl;

  // যে পেজগুলো লক করতে চাই
  const protectedPaths = ['/dashboard', '/admin', '/post-ad', '/lead'];

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      // যদি লগইন না থাকে, তবেই হোমপেজে পাঠাবে
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // লগইন থাকলে বা অন্য পেজ হলে স্বাভাবিকভাবে চলতে দাও
  return NextResponse.next();
}

// এই কনফিগটি একদম শেষে আলাদাভাবে থাকবে
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/post-ad', '/lead/:path*'],
};