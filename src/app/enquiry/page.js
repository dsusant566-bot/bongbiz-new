"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient"; // সুপাবেস ইম্পোর্ট করা হলো

export default function EnquiryPage() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', service_type: 'General',
    address: '', occupation: '', description: '', requirement: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // সুপাবেসে ডাটা পাঠানো হচ্ছে
      const { error } = await supabase
        .from("enquiries")
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            service_type: formData.service_type,
            address: formData.address,
            occupation: formData.occupation,
            requirement: formData.requirement,
            description: formData.description,
          },
        ]);

      if (error) throw error;

      alert("ধন্যবাদ! আপনার ইনকোয়ারি সফলভাবে জমা হয়েছে।");
      // ফর্ম রিসেট
      setFormData({ 
        name: '', phone: '', email: '', service_type: 'General', 
        address: '', occupation: '', description: '', requirement: '' 
      });
      
    } catch (error) {
      console.error("Error:", error.message);
      alert("সার্ভারে ডাটা পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-300">
        
        {/* হেডার */}
        <div className="bg-[#4B0082] p-8 text-center text-white">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Send Enquiry</h2>
          <p className="text-gray-300 text-[10px] mt-1 font-bold uppercase">BongoBiz Business Support</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
          
          {/* সার্ভিস টাইপ */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-black text-slate-700 uppercase mb-2">Service Type</label>
            <select 
              className="w-full p-4 rounded-xl bg-white border-2 border-slate-400 focus:border-purple-600 outline-none font-bold text-slate-900 transition-all"
              onChange={(e) => setFormData({...formData, service_type: e.target.value})}
              value={formData.service_type}
            >
              <option value="General">Select Service</option>
              <option value="Resale">Resale Support</option>
              <option value="Property">Property/Real Estate</option>
              <option value="Wholesale">Wholesale/B2B</option>
              <option value="Services">Professional Services</option>
            </select>
          </div>

          {/* নাম */}
          <div className="flex flex-col">
            <label className="text-[11px] font-black text-slate-700 uppercase mb-2">Full Name</label>
            <input 
              type="text" placeholder="Your Name" required 
              className="p-4 rounded-xl bg-white border-2 border-slate-400 focus:border-purple-600 outline-none font-bold text-slate-900" 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              value={formData.name}
            />
          </div>

          {/* ফোন */}
          <div className="flex flex-col">
            <label className="text-[11px] font-black text-slate-700 uppercase mb-2">Phone Number</label>
            <input 
              type="number" placeholder="Mobile Number" required 
              className="p-4 rounded-xl bg-white border-2 border-slate-400 focus:border-purple-600 outline-none font-bold text-slate-900" 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              value={formData.phone}
            />
          </div>

          {/* ইমেল */}
          <div className="flex flex-col">
            <label className="text-[11px] font-black text-slate-700 uppercase mb-2">Email Address</label>
            <input 
              type="email" placeholder="Email (Optional)" 
              className="p-4 rounded-xl bg-white border-2 border-slate-400 focus:border-purple-600 outline-none font-bold text-slate-900" 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              value={formData.email}
            />
          </div>

          {/* অ্যাড্রেস */}
          <div className="flex flex-col">
            <label className="text-[11px] font-black text-slate-700 uppercase mb-2">Full Address</label>
            <input 
              type="text" placeholder="Village/City, District" 
              className="p-4 rounded-xl bg-white border-2 border-slate-400 focus:border-purple-600 outline-none font-bold text-slate-900" 
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              value={formData.address}
            />
          </div>

          {/* পেশা */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-[11px] font-black text-slate-700 uppercase mb-2">Occupation</label>
            <input 
              type="text" placeholder="Your Profession" 
              className="p-4 rounded-xl bg-white border-2 border-slate-400 focus:border-purple-600 outline-none font-bold text-slate-900" 
              onChange={(e) => setFormData({...formData, occupation: e.target.value})}
              value={formData.occupation}
            />
          </div>

          {/* রিকোয়ারমেন্ট সামারি */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-[11px] font-black text-slate-700 uppercase mb-2">Requirement Summary</label>
            <input 
              type="text" placeholder="What exactly do you need?" 
              className="p-4 rounded-xl bg-white border-2 border-slate-400 focus:border-purple-600 outline-none font-bold text-slate-900" 
              onChange={(e) => setFormData({...formData, requirement: e.target.value})}
              value={formData.requirement}
            />
          </div>

          {/* ডিটেইলস ডেসক্রিপশন */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-[11px] font-black text-slate-700 uppercase mb-2">Detailed Description</label>
            <textarea 
              placeholder="Describe your requirement in detail..." 
              className="p-4 rounded-xl bg-white border-2 border-slate-400 focus:border-purple-600 outline-none font-bold text-slate-900" 
              rows="4" 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              value={formData.description}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="md:col-span-2 bg-[#7B00FF] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 mt-4 disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Enquiry"}
          </button>

          <Link href="/" className="md:col-span-2 text-center mt-4 text-slate-500 font-bold uppercase text-[10px] hover:text-purple-600 no-underline">
            ← Back to BongoBiz Home
          </Link>
        </form>
      </div>
    </div>
  );
}