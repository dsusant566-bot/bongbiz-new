"use client";
import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from 'next/navigation';

export default function EditAd() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adData, setAdData] = useState({ 
    title: '', 
    price: '', 
    description: '', 
    location: '', 
    contact_number: '' 
  });

  useEffect(() => {
    async function getAdDetails() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setAdData(data);
        setLoading(false);
      }
    }
    getAdDetails();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('listings')
      .update({
        title: adData.title,
        price: adData.price,
        description: adData.description,
        location: adData.location,
        contact_number: adData.contact_number
      })
      .eq('id', id);

    if (!error) {
      alert("অ্যাডটি সফলভাবে আপডেট হয়েছে!");
      router.push('/dashboard');
    } else {
      alert("আপডেট করতে সমস্যা হয়েছে।");
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase font-black italic text-blue-600">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl w-full max-w-xl border border-gray-100">
        
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black uppercase italic text-slate-800">
            UPDATE YOUR <span className="text-blue-600">AD</span>
          </h1>
          <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">Modify listing details</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Ad Title</label>
            <input 
              className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all text-slate-700"
              value={adData.title} 
              onChange={(e) => setAdData({...adData, title: e.target.value})} 
            />
          </div>

          {/* Price & Location in Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Price (₹)</label>
              <input 
                className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all text-slate-700"
                value={adData.price} 
                onChange={(e) => setAdData({...adData, price: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Location</label>
              <input 
                className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all text-slate-700"
                value={adData.location} 
                onChange={(e) => setAdData({...adData, location: e.target.value})} 
              />
            </div>
          </div>

          {/* Contact Number */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Contact Number</label>
            <input 
              className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all text-slate-700"
              value={adData.contact_number} 
              onChange={(e) => setAdData({...adData, contact_number: e.target.value})} 
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Description</label>
            <textarea 
              className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 transition-all text-slate-700 h-24 resize-none"
              value={adData.description} 
              onChange={(e) => setAdData({...adData, description: e.target.value})} 
            />
          </div>

          {/* Update Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-[11px] shadow-lg hover:bg-black transition-all tracking-widest mt-2">
            UPDATE AD NOW
          </button>
          
          <button type="button" onClick={() => router.back()} className="w-full text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-red-500 transition-all mt-1">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}