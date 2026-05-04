"use client";
import React, { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";

export default function ContactLeadForm({ ad, mode = "button" }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // কড়া ভ্যালিডেশন: ১০ সংখ্যার কম বা বেশি হলে এখানেই আটকে দেবে
    if (formData.phone.length !== 10) {
      alert("দয়া করে ১০ সংখ্যার সঠিক মোবাইল নাম্বার দিন।");
      return; // এটি নিচের কোড চলতে দেবে না
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
      if (mode === "whatsapp" || mode === "full-whatsapp") {
        window.open(`https://wa.me/91${ad.contact_number}?text=Hi, I am interested in: ${ad.title}`, '_blank');
      } else {
        window.location.href = `tel:${ad.contact_number}`;
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* আপনার পুরনো সব বাটন মোড এখানে থাকবে */}
      {mode === "call" && (
        <button onClick={() => setShowForm(true)} className="w-9 h-9 bg-[#007bff] text-white flex items-center justify-center rounded-xl shadow-md relative z-30">📞</button>
      )}
      {mode === "whatsapp" && (
        <button onClick={() => setShowForm(true)} className="w-9 h-9 bg-[#25D366] text-white flex items-center justify-center rounded-xl shadow-md relative z-30">💬</button>
      )}
      {mode === "full-call" && (
        <button onClick={() => setShowForm(true)} className="w-full bg-[#00adef] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">📞 CALL / CONTACT SELLER</button>
      )}
      {mode === "full-whatsapp" && (
        <button onClick={() => setShowForm(true)} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">💬 CHAT ON WHATSAPP</button>
      )}
      {mode === "button" && (
        <button onClick={() => setShowForm(true)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Call / Contact Seller</button>
      )}

      {showForm && (
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
              
              <input 
                required 
                type="tel" 
                minLength={10} // ১০ সংখ্যার নিচে সাবমিট হবে না
                maxLength={10} // ১০ সংখ্যার বেশি টাইপ হবে না
                placeholder="10 DIGIT PHONE NUMBER" 
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm font-bold" 
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // শুধু নাম্বার নেবে
                  setFormData({...formData, phone: e.target.value});
                }}
              />
              
              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
              >
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