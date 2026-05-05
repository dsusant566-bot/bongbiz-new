"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdLeads, setSelectedAdLeads] = useState([]); 
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUserAndFetchAds();
  }, []);

  async function checkUserAndFetchAds() {
    setLoading(true);
    
    // ১. কারেন্ট সেশন থেকে ইউজার চেক করা (লগইন চেক)
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      // যদি লগইন না থাকে, তবে সাথে সাথে লগইন পেজে পাঠিয়ে দেবে
      router.replace('/login'); 
      return;
    }

    // ২. শুধুমাত্র লগইন করা ইউজারের ইমেইল দিয়ে অ্যাডগুলো ফিল্টার করা
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_deleted', false)
      .eq('user_email', user.email) // ট্যাগিং: শুধু নিজের ইমেইল এর অ্যাড আসবে
      .order('created_at', { ascending: false });

    if (!error) {
      setAds(data);
    } else {
      console.error("Error fetching ads:", error.message);
    }
    setLoading(false);
  }

  // লিড দেখার ফাংশন (আগের মতোই রাখা হয়েছে)
  async function viewLeads(adId) {
    setShowLeadModal(true);
    setModalLoading(true);
    const { data, error } = await supabase
      .from('visitor_leads')
      .select('*')
      .eq('item_id', adId)
      .order('created_at', { ascending: false });

    if (!error) {
      setSelectedAdLeads(data);
    } else {
      console.error("Error fetching leads:", error.message);
    }
    setModalLoading(false);
  }

  // অ্যাড ডিলিট করার ফাংশন
  async function deleteAd(id) {
    if (window.confirm("আপনি কি নিশ্চিত যে এই অ্যাডটি সরাতে চান?")) {
      const { error } = await supabase
        .from('listings')
        .update({ is_deleted: true }) 
        .eq('id', id);

      if (!error) {
        alert("অ্যাডটি সরানো হয়েছে।");
        checkUserAndFetchAds(); 
      } else {
        alert("সমস্যা হয়েছে: " + error.message);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-slate-800 uppercase italic">
            Admin <span className="text-blue-600">Dashboard</span>
          </h1>
          <Link href='/post-ad' className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase shadow-lg hover:bg-black transition-all">
            + New Ad
          </Link>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0056b3] text-white">
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">Image</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">Title</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">Price</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="p-10 text-center font-bold text-gray-400">LOADING...</td></tr>
                ) : ads.length > 0 ? (
                  ads.map((ad) => (
                    <tr key={ad.id} className="border-b border-gray-50 hover:bg-blue-50 transition-colors">
                      <td className="p-4">
                        <img src={ad.image_url_1 || "https://via.placeholder.com/50"} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt="" />
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{ad.title}</p>
                        <p className="text-[9px] text-gray-400 font-black uppercase">{ad.category}</p>
                      </td>
                      <td className="p-4 font-black text-blue-600 text-sm">₹{ad.price}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => viewLeads(ad.id)} title="View Leads" className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-lg shadow-sm">
                            👁️
                          </button>
                          <Link href={`/dashboard/edit/${ad.id}`} className="bg-amber-100 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-600 hover:text-white transition-all text-[10px] font-black uppercase">
                            Edit
                          </Link>
                          <button onClick={() => deleteAd(ad.id)} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="p-20 text-center text-gray-300 font-black uppercase text-xs">No Ads Found for Your Email</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Leads Modal (পপ-আপ) --- */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowLeadModal(false)}>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100">
              <h2 className="text-xl font-black text-slate-900 uppercase italic">Ad Contact Leads</h2>
              <button onClick={() => setShowLeadModal(false)} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm">✕</button>
            </div>
            
            {modalLoading ? (
              <div className="text-center py-10 font-black text-blue-500 animate-pulse uppercase">Loading Leads...</div>
            ) : selectedAdLeads.length > 0 ? (
              <div className="space-y-4">
                {selectedAdLeads.map(lead => (
                  <div key={lead.id} className="p-5 bg-slate-50 rounded-[2rem] flex justify-between items-center border border-slate-100">
                    <div>
                      <p className="font-black text-slate-900 uppercase text-[11px] leading-none mb-1">{lead.visitor_name}</p>
                      <p className="text-blue-600 font-bold text-sm tracking-tight">{lead.visitor_phone}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">
                        {new Date(lead.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <a href={`tel:${lead.visitor_phone}`} className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-black transition-all">📞</a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-300 font-bold italic uppercase tracking-widest">No leads yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}