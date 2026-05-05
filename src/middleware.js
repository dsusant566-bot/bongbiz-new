import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const adminEmail = "dsusant566@gmail.com";
  const { pathname } = req.nextUrl;

  // অ্যাডমিন পাথ সুরক্ষা
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!session || session.user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/admin-control/:path*', '/admin-leads/:path*', '/admin-enquiries/:path*'],
};