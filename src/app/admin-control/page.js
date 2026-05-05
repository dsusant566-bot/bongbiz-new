"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminControlPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);

  // সিকিউরিটি: শুধুমাত্র আপনি ঢুকতে পারবেন
  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.email !== "dsusant566@gmail.com")) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.email === "dsusant566@gmail.com") {
      fetchAllAds();
    }
  }, [session]);

  const fetchAllAds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (!error) setAllAds(data);
    setLoading(false);
  };

  // অ্যাড ডিলিট বা স্ট্যাটাস চেঞ্জের লজিক এখানে থাকবে (আগের মতোই)
  const toggleStatus = async (id, field, currentValue) => {
    const { error } = await supabase
      .from('listings')
      .update({ [field]: !currentValue })
      .eq('id', id);
    if (!error) fetchAllAds();
  };

  if (status === "loading") return <div className="text-center py-20 font-bold">Checking Access...</div>;
  if (!session || session.user.email !== "dsusant566@gmail.com") return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8 border-l-8 border-orange-600 pl-4">
          Admin <span className="text-orange-600">Control Panel</span>
        </h1>

        {loading ? (
          <div className="text-center py-20 uppercase font-bold text-xs">Loading Listings...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allAds.map((ad) => (
              <div key={ad.id} className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center border border-slate-100">
                <div className="flex items-center gap-4">
                  <img src={ad.image_url_1} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                  <div>
                    <h3 className="font-black text-sm uppercase">{ad.title}</h3>
                    <p className="text-blue-600 font-bold">₹{ad.price}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleStatus(ad.id, 'is_featured', ad.is_featured)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${ad.is_featured ? 'bg-yellow-400' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {ad.is_featured ? "⭐ Featured" : "Make Featured"}
                  </button>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}