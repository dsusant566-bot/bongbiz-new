import { NextResponse } from 'next/server';

export function middleware(request) {
  // টোকেন চেক করা (সব ধরণের টোকেন চেক করবে)
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token') ||
                request.cookies.get('sb-access-token');
  
  const { pathname } = request.nextUrl;

  // যে পেজগুলো লক করতে চাই
  const protectedPaths = ['/dashboard', '/admin', '/post-ad', '/lead'];

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      // লগইন না থাকলে হোমপেজে পাঠাবে
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/post-ad', '/lead/:path*'],
};