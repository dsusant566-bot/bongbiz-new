"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function FloatingButtons() {
  const { data: session } = useSession();
  const router = useRouter();
  const WHATSAPP_NUMBER = "917585999923"; 

  const handleSellClick = (e) => {
    e.preventDefault();
    if (!session) {
      // লগইন না থাকলে হোমপেজে না পাঠিয়ে সরাসরি গুগলে লগইন করতে বলবে
      signIn('google');
    } else {
      // লগইন থাকলে পোস্ট-অ্যাড পেজে যাবে
      router.push("/post-ad");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 items-end">
      
      {/* Sell Now Button as a Button for better control */}
      <button 
        onClick={handleSellClick} 
        className="sell-now-btn"
        style={{ 
          cursor: 'pointer', 
          border: 'none', 
          backgroundColor: '#ffcc00', // হলুদ রঙ যাতে চোখে পড়ে
          padding: '12px 24px',
          borderRadius: '50px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        <span className="mr-2">+</span> SELL NOW
      </button>

      {/* WhatsApp Button remains same as it's working */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi BongoBiz`}
        target="_blank"
        className="contact-us-btn"
        style={{ textDecoration: 'none' }}
      >
        <span style={{fontSize: '18px'}}>💬</span> Contact Us
      </a>
    </div>
  );
}