"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminControlPage() {
  const [user, setUser] = useState(null);
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', price: '', description: '', category: '', sub_category: '', item_type: '', district: '', state: '', location: '', contact_number: '' });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || currentUser.email !== "dsusant566@gmail.com") {
        router.push("/");
      } else {
        setUser(currentUser);
        fetchAllAds();
      }
    };
    checkUser();
  }, [router]);

  const fetchAllAds = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('listings').select('*').eq('is_deleted', false).order('created_at', { ascending: false });
    if (!error) setAllAds(data);
    setLoading(false);
  };

  const toggleStatus = async (id, field, currentValue) => {
    const { error } = await supabase.from('listings').update({ [field]: !currentValue }).eq('id', id);
    if (!error) setAllAds(allAds.map(ad => ad.id === id ? { ...ad, [field]: !currentValue } : ad));
  };

  const softDeleteAd = async (id, title) => {
    if (confirm(`ডিলিট করতে চান?`)) {
      const { error } = await supabase.from('listings').update({ is_deleted: true }).eq('id', id);
      if (!error) fetchAllAds();
    }
  };

  if (loading && !user) return <div className="text-center py-20 font-black uppercase text-xs">Checking Admin Access...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8 border-l-8 border-[#ff6600] pl-4">Admin <span className="text-[#ff6600]">Control</span></h1>
        <div className="grid grid-cols-1 gap-4">
          {allAds.map((ad) => (
            <div key={ad.id} className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border">
              <div className="flex items-center gap-5 w-full">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden relative">
                  <img src={ad.image_url_1} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase italic text-slate-800">{ad.title}</h3>
                  <p className="text-sm text-[#00a2ed] font-black">₹{ad.price}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <button onClick={() => toggleStatus(ad.id, 'is_featured', ad.is_featured)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${ad.is_featured ? 'bg-yellow-400' : 'bg-white text-slate-400'}`}>{ad.is_featured ? "⭐ Featured" : "Make Featured"}</button>
                <button onClick={() => toggleStatus(ad.id, 'is_sold', ad.is_sold)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${ad.is_sold ? 'bg-red-600 text-white' : 'bg-white text-slate-400'}`}>{ad.is_sold ? "🚫 Sold" : "Mark Sold"}</button>
                <button onClick={() => softDeleteAd(ad.id, ad.title)} className="bg-red-50 text-red-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}