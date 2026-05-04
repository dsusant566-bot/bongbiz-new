import { NextResponse } from 'next/server';

export function middleware(request) {
  // সেশন টোকেন চেক করা (Vercel-এ এর নাম অনেক সময় বদলে যায়)
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token');
  
  const protectedPaths = ['/admin', '/admin-control', '/lead', '/enquiry'];

  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      // যদি আপনার আলাদা /login পেজ না থাকে, তবে নিচের '/' ইউআরএল ব্যবহার করুন
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}