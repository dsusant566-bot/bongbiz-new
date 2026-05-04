"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. ডাটা লোড করা
  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("visitor_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setLeads(data);
    setLoading(false);
  }

  // ২. ডিলিট ফাংশন (FIXED)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      // ডাটাবেস থেকে ডিলিট করা
      const { error } = await supabase
        .from("visitor_leads")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Error deleting: " + error.message);
      } else {
        // সাকসেস হলে স্টেট থেকে ফিল্টার করে সরিয়ে দেওয়া (যাতে রিফ্রেশ না করলেও চলে যায়)
        setLeads(leads.filter(lead => lead.id !== id));
        alert("Lead deleted successfully!");
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">LOADING DASHBOARD...</div>;

  return (
    /* overflow-x-hidden দেওয়া হয়েছে যাতে স্ক্রিন ডান-বামে না নড়ে */
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-10 shadow-xl">
        <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Admin Dashboard</h1>
        <p className="text-slate-400 text-xs font-bold uppercase mt-2">Manage your inquiries and leads</p>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
             <p className="text-slate-400 text-[10px] font-black uppercase">Total Inquiries</p>
             <h2 className="text-4xl font-black text-blue-600">{leads.length}</h2>
          </div>
        </div>

        {/* টেবিল সেকশন - overflow-auto দেওয়া হয়েছে যাতে মোবাইলে টেবিলটা স্ক্রল হয়, পুরো পেজ নয় */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black uppercase italic text-slate-800">Recent Leads</h3>
            <button onClick={fetchLeads} className="bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase">Refresh</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-6">Visitor Details</th>
                  <th className="p-6">Interested In</th>
                  <th className="p-6">Date</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <p className="font-black text-slate-900 uppercase text-sm">{lead.visitor_name}</p>
                      <p className="text-blue-600 font-bold text-xs">{lead.visitor_phone}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-slate-600 font-bold text-xs uppercase line-clamp-1">{lead.item_title}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-slate-400 font-bold text-[10px]">{new Date(lead.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {leads.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs">No leads found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}