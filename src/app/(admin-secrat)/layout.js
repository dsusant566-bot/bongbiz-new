"use client";
import { supabase } from "@/lib/supabaseClient"; // আপনার সুপাবেজ ক্লায়েন্ট
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const adminEmail = "dsusant566@gmail.com"; // আপনার মেইল

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user.email === adminEmail) {
        setIsAdmin(true);
      } else {
        router.replace("/"); // অ্যাডমিন না হলে হোমপেজে পাঠাও
      }
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-bold italic animate-pulse text-purple-700">Checking Admin Credentials...</p>
      </div>
    );
  }

  // যদি অ্যাডমিন হয় তবেই ভেতরটা দেখাও
  return isAdmin ? <>{children}</> : null;
}