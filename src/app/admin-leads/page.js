"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react"; // সুরক্ষা চেক
import { useRouter } from "next/navigation"; // রিডাইরেক্ট

export default function AdminLeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- সিকিউরিটি চেক শুরু ---
  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.email !== "dsusant566@gmail.com")) {
      router.push("/");
    }
  }, [status, session, router]);
  // --- সিকিউরিটি চেক শেষ ---

  useEffect(() => {
    if (session && session.user.email === "dsusant566@gmail.com") {
      fetchLeads();
    }
  }, [session]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visitor_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data);
    } catch (err) {
      console.error("Error fetching leads:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // পার্মানেন্ট ডিলিট ফাংশন
  const handleDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই লিডটি চিরতরে ডিলিট করতে চান? (এটি ডাটাবেস থেকেও মুছে যাবে)")) {
      try {
        const { error } = await supabase.from('visitor_leads').delete().eq('id', id);
        if (error) throw error;
        
        // ডাটাবেস থেকে ডিলিট হওয়ার পর লিস্ট আপডেট
        setLeads(leads.filter(lead => lead.id !== id));
        alert("লিড সফলভাবে চিরতরে ডিলিট হয়েছে।");
      } catch (err) {
        alert("ডিলিট করতে সমস্যা হয়েছে: " + err.message);
      }
    }
  };

  // লোডিং বা আনঅথরাইজড ইউজার হলে কিছুই দেখাবে না
  if (status === "loading") return <div className="text-center py-20 font-black uppercase text-slate-400">Checking Access...</div>;
  if (!session || session.user.email !== "dsusant566@gmail.com") return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic">
              Visitor <span className="text-[#ff6600]">Leads</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              যারা বিজ্ঞাপনে কল করার চেষ্টা করেছে তাদের তালিকা
            </p>
          </div>
          <button 
            onClick={fetchLeads}
            className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black shadow-sm border hover:bg-slate-50"
          >
            REFRESH
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-black text-[#00a2ed] animate-pulse uppercase">Loading Leads...</div>
        ) : leads.length > 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                    <th className="p-5">তারিখ</th>
                    <th className="p-5">নাম</th>
                    <th className="p-5">ফোন নাম্বার</th>
                    <th className="p-5">বিজ্ঞাপনের নাম (Item)</th>
                    <th className="p-5 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-sm">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-5 text-[11px] font-bold text-slate-400">
                        {new Date(lead.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-5 font-black text-slate-900 uppercase italic">{lead.visitor_name}</td>
                      <td className="p-5">
                        <span className="text-[#00a2ed] font-bold">{lead.visitor_phone}</span>
                      </td>
                      <td className="p-5 text-slate-500 font-medium">{lead.item_title || 'N/A'}</td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-3">
                          <a 
                            href={`tel:${lead.visitor_phone}`} 
                            className="bg-green-100 text-green-600 p-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Call Visitor"
                          >
                            📞
                          </a>
                          <button 
                            onClick={() => handleDelete(lead.id)}
                            className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Delete Lead"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] text-slate-300 font-bold uppercase italic">
            No Leads Found Yet
          </div>
        )}
      </div>
    </div>
  );
}