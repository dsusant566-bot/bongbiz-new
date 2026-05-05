"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const adminEmail = "dsusant566@gmail.com";

  useEffect(() => {
    // যদি চেক শেষ হয় এবং সেশন না থাকে অথবা ইমেইল না মেলে, তবে হোমপেজে রিডাইরেক্ট
    if (status !== "loading" && (!session || session.user.email !== adminEmail)) {
      router.replace("/");
    }
  }, [session, status, router]);

  // চেক করার সময় এই লোডিং দেখাবে
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-bold italic uppercase animate-pulse text-blue-600">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // যদি আইডি না মেলে তবে কিছুই দেখাবে না
  if (!session || session.user.email !== adminEmail) return null;

  return <>{children}</>;
}