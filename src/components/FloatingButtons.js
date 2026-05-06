"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // আপনার সুপাবেজ ক্লায়েন্ট পাথ চেক করে নেবেন

export default function FloatingButtons() {
  const router = useRouter();
  const WHATSAPP_NUMBER = "917585999923"; 

  const handleSellClick = async (e) => {
    e.preventDefault();

    // বর্তমানে কোনো ইউজার লগইন আছে কি না তা চেক করা
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // যদি লগইন না থাকে, তবে সুপাবেজ দিয়ে গুগল লগইন শুরু করা
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // লগইন শেষ হওয়ার পর ইউজারকে কোন পেজে পাঠাবে (অবশ্যই সঠিক ডোমেইন দেবেন)
          redirectTo: `${window.location.origin}/post-ad`,
        },
      });

      if (error) {
        console.error("Login Error:", error.message);
        alert("লগইন করতে সমস্যা হচ্ছে: " + error.message);
      }
    } else {
      // লগইন থাকলে সরাসরি পোস্ট-অ্যাড পেজে যাবে
      router.push("/post-ad");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 items-end">
      
      <button 
        onClick={handleSellClick} 
        className="sell-now-btn"
        style={{ 
          cursor: 'pointer', 
          border: 'none', 
          backgroundColor: '#ffcc00',
          padding: '12px 24px',
          borderRadius: '50px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          color: '#000'
        }}
      >
        <span className="mr-2">+</span> SELL NOW
      </button>

      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi BongoBiz`}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-us-btn"
        style={{ 
          textDecoration: 'none',
          backgroundColor: '#25D366',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '50px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        <span style={{fontSize: '18px'}}>💬</span> Contact Us
      </a>
    </div>
  );
}