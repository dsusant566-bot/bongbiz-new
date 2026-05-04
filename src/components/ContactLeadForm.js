"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from "@/lib/supabaseClient";

export default function ContactLeadForm({ ad, mode = "button" }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // পোর্টাল কাজ করার জন্য এটি প্রয়োজন
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      alert("দয়া করে ১০ সংখ্যার মোবাইল নাম্বার দিন");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("visitor_leads").insert([{
      visitor_name: formData.name,
      visitor_phone: formData.phone,
      item_title: ad.title,
      item_id: ad.id
    }]);
    
    if (!error) {
      setShowForm(false);
      window.location.href = `tel:${ad.contact_number}`;
    }
    setSubmitting(false);
  };

  const openForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowForm(true);
  };

  return (
    <>
      {/* ১. হোম পেজের কার্ডের ছোট বাটন দুটো (যেমন ছিল) */}
      {mode === "call" && (
        <button onClick={openForm} className="w-9 h-9 bg-[#007bff] text-white flex items-center justify-center rounded-xl shadow-md">📞</button>
      )}
      {mode === "whatsapp" && (
        <button onClick={openForm} className="w-9 h-9 bg-[#25D366] text-white flex items-center justify-center rounded-xl shadow-md">💬</button>
      )}

      {/* ২. ডিটেইলস পেজের বড় নীল কল বাটন (যেমন ছবি ৬-এ আছে) */}
      {mode === "full-call" && (
        <button onClick={openForm} className="w-full bg-[#00adef] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2">
          📞 CALL SELLER
        </button>
      )}

      {/* ৩. ডিটেইলস পেজের বড় সবুজ WhatsApp বাটন (যা উধাও হয়ে গিয়েছিল, তা ফিরিয়ে আনা হলো) */}
      {mode === "full-whatsapp" && (
        <button onClick={openForm} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2">
          💬 CONTACT ON WHATSAPP
        </button>
      )}

      {/* ৪. পপ-আপ ফর্ম (এখানে পোর্টাল ব্যবহার করা হয়েছে এবং লেখার কালার কালো করা হয়েছে) */}
      {showForm && mounted && createPortal(
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" style={{ zIndex: 999999 }}>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black text-slate-900 uppercase italic mb-4 text-center">Contact Seller</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ইনপুট ১: 'text-black' অ্যাড করা হয়েছে যাতে লেখা বোঝা যায় */}
              <input 
                required 
                type="text" 
                placeholder="YOUR NAME" 
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm font-bold text-black" 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              
              {/* ইনপুট ২: 'text-black' অ্যাড করা হয়েছে যাতে লেখা বোঝা যায় */}
              <input 
                required 
                type="tel" 
                maxLength="10" 
                placeholder="10 DIGIT PHONE NUMBER" 
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm font-bold text-black" 
                onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, ''); setFormData({...formData, phone: e.target.value});}}
              />
              
              <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                {submitting ? "SAVING..." : "SUBMIT & CONTACT"}
              </button>
              
              <button type="button" onClick={() => setShowForm(false)} className="w-full text-slate-500 text-[10px] font-black uppercase mt-2">CLOSE</button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}