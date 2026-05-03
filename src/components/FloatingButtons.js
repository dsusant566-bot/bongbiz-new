"use client";
import React from 'react';

export default function FloatingButtons() {
  const WHATSAPP_NUMBER = "917585999923"; 

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 items-end">
      
      {/* ১. Sell Now বাটন - এটি সরাসরি ফর্মে নিয়ে যাবে */}
      <a href="/post-ad" className="sell-now-btn">
        <span>+</span> SELL NOW
      </a>

      {/* ২. WhatsApp বাটন */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi BongoBiz`}
        target="_blank"
        className="contact-us-btn"
      >
        <span style={{fontSize: '18px'}}>💬</span> Contact Us
      </a>
    </div>
  );
}