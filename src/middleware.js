import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  
  // সরাসরি ক্লায়েন্ট তৈরি করা হচ্ছে যা মিডলওয়্যারে কাজ করবে
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // কুকি থেকে সেশন টোকেন নেওয়া
  const token = req.cookies.get('sb-access-token')?.value || req.cookies.get('supabase-auth-token')?.value
  
  // সেশন চেক (টোকেন না থাকলে সরাসরি রিডাইরেক্ট)
  const { data: { user } } = await supabase.auth.getUser(token)

  const adminEmail = "dsusant566@gmail.com";
  const { pathname } = req.nextUrl;
  const adminPaths = ['/admin', '/admin-control', '/admin-leads', '/admin-enquiries'];
  
  if (adminPaths.some(path => pathname.startsWith(path))) {
    // ইউজার না থাকলে বা ইমেইল না মিললে হোম পেজে পাঠান
    if (!user || user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/admin-control/:path*', '/admin-leads/:path*', '/admin-enquiries/:path*'],
}