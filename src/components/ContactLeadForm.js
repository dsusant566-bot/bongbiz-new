"use client";
import React, { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";

export default function ContactLeadForm({ ad, mode = "button" }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ফোন নাম্বার ভ্যালিডেশন (১০ ডিজিট চেক)
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
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
      // হোয়াটসঅ্যাপ মোড হলে হোয়াটসঅ্যাপ খুলবে, বাকি সব ক্ষেত্রে ডায়াল প্যাড
      // ad.contact_number এর আগে ৯১ যোগ করা হয়েছে যাতে হোয়াটসঅ্যাপে মেসেজ যায়
      if (mode === "whatsapp" || mode === "full-whatsapp") {
        window.open(`https://wa.me/91${ad.contact_number}?text=Hi, I am interested in: ${ad.title}`, '_blank');
      } else {
        window.location.href = `tel:${ad.contact_number}`;
      }
    } else {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* ১. হোমপেজের ছোট কল বাটন - z-index দেওয়া হলো যাতে কার্ডের উপরে থাকে */}
      {mode === "call" && (
        <button onClick={() => setShowForm(true)} className="w-9 h-9 bg-[#007bff] text-white flex items-center justify-center rounded-xl shadow-md relative z-30">📞</button>
      )}

      {/* ২. হোমপেজের ছোট হোয়াটসঅ্যাপ বাটন */}
      {mode === "whatsapp" && (
        <button onClick={() => setShowForm(true)} className="w-9 h-9 bg-[#25D366] text-white flex items-center justify-center rounded-xl shadow-md relative z-30">💬</button>
      )}

      {/* ৩. সাইডবারের বড় নীল কল বাটন */}
      {mode === "full-call" && (
        <button onClick={() => setShowForm(true)} className="w-full bg-[#00adef] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">📞 CALL / CONTACT SELLER</button>
      )}

      {/* ৪. সাইডবারের বড় সবুজ হোয়াটসঅ্যাপ বাটন */}
      {mode === "full-whatsapp" && (
        <button onClick={() => setShowForm(true)} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">💬 CHAT ON WHATSAPP</button>
      )}

      {/* ৫. ডিফল্ট বাটন */}
      {mode === "button" && (
        <button onClick={() => setShowForm(true)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Call / Contact Seller</button>
      )}

      {showForm && (
        /* z-[10000] দেওয়া হয়েছে যাতে ফর্মটি সব কিছুর উপরে ভেসে ওঠে */
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 uppercase italic mb-2 text-center">Contact Seller</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                required 
                type="text" 
                placeholder="YOUR NAME" 
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm font-bold" 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              
              {/* ফোন নাম্বারের জন্য ভ্যালিডেশন যোগ করা হয়েছে */}
              <input 
                required 
                type="tel" 
                pattern="[0-9]{10}" 
                maxLength="10"
                placeholder="10 DIGIT PHONE NUMBER" 
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm font-bold" 
                onInput={(e) => {
                  // শুধু নাম্বার টাইপ করতে দেবে
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({...formData, phone: e.target.value});
                }}
              />

              <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                {submitting ? "SAVING..." : "SUBMIT & CONTACT"}
              </button>
              
              <button type="button" onClick={() => setShowForm(false)} className="w-full text-slate-300 text-[9px] font-black uppercase mt-2">CANCEL</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}