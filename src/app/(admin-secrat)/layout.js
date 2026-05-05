"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // মেইল আইডিটা ছোট হাতের অক্ষরে লিখুন
  const adminEmail = "dsusant566@gmail.com".toLowerCase();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    } else if (status === "authenticated") {
      const userEmail = session?.user?.email?.toLowerCase();
      if (userEmail !== adminEmail) {
        console.log("ভুল ইমেইল আইডি:", userEmail);
        router.replace("/");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse font-bold text-blue-600">নিরাপত্তা চেক করা হচ্ছে...</p>
      </div>
    );
  }

  // যদি সেশন থাকে এবং ইমেইল মিলে যায়
  if (status === "authenticated" && session?.user?.email?.toLowerCase() === adminEmail) {
    return <>{children}</>;
  }

  return null;
}