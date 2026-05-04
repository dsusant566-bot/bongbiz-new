import { NextResponse } from 'next/server';

export function middleware(request) {
  // সেশন টোকেন চেক (Vercel ও লোকাল দুই জায়গার জন্যই)
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token') ||
                request.cookies.get('supabase-auth-token'); // সুপাবেস টোকেনও চেক করবে
  
  const { pathname } = request.nextUrl;

  // যে পেজগুলো লগইন ছাড়া দেখা যাবে না
  const protectedPaths = ['/admin', '/admin-control', '/lead', '/enquiry', '/dashboard', '/post-ad'];

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      // লগইন না থাকলে হোমপেজে পাঠিয়ে দাও
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/lead/:path*', '/enquiry/:path*', '/post-ad'],
};