import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // এটি সরাসরি সুপাবেজের ইউজার সেশন চেক করবে
  const { data: { user } } = await supabase.auth.getUser()

  const adminEmail = "dsusant566@gmail.com";
  const { pathname } = req.nextUrl;
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  
  if (adminPaths.some(path => pathname.startsWith(path))) {
    // যদি ইউজার না থাকে অথবা ইমেইল আপনার মেইলের সাথে না মেলে
    if (!user || user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/admin-control/:path*', '/admin-leads/:path*', '/admin-enquiries/:path*'],
}