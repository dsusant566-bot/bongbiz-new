"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      // সরাসরি আপনার 'visitor_leads' টেবিল থেকে সব ডেটা আনা হচ্ছে
      const { data, error } = await supabase
        .from("visitor_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data);
    } catch (err) {
      console.error("Error fetching leads:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই লিডটি চিরতরে ডিলিট করতে চান?")) {
      try {
        const { error } = await supabase.from('visitor_leads').delete().eq('id', id);
        if (error) throw error;
        setLeads(leads.filter(item => item.id !== id));
        alert("সফলভাবে মুছে ফেলা হয়েছে।");
      } catch (err) {
        alert("ভুল হয়েছে: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="border-l-8 border-blue-600 pl-4">
            <h1 className="text-3xl font-black uppercase italic text-slate-800">Visitor <span className="text-blue-600">Leads</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">BongoBiz Admin Panel</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-3">
            <span className="text-sm font-black text-slate-500 uppercase">Total Leads: </span>
            <span className="text-xl font-black text-blue-600">{leads.length}</span>
            <button onClick={fetchLeads} className="ml-4 text-[10px] font-black text-slate-300 hover:text-blue-600">REFRESH</button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                  <th className="px-6 py-5 font-black">Date</th>
                  <th className="px-6 py-5 font-black">Visitor Detail</th>
                  <th className="px-6 py-5 font-black">Item Title (বিজ্ঞাপনের নাম)</th>
                  <th className="px-6 py-5 font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.length > 0 ? (
                  leads.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <p className="text-[11px] font-black text-slate-400 uppercase">
                          {new Date(item.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-black text-slate-800 uppercase text-xs">{item.visitor_name}</p>
                        <p className="text-[11px] font-bold text-blue-600">{item.visitor_phone}</p>
                      </td>
                      <td className="px-6 py-5">
                        {/* আপনার ডাটাবেসের item_title কলাম থেকে সরাসরি নাম দেখাচ্ছে */}
                        <p className="text-[11px] font-black text-slate-700 uppercase leading-tight">
                          {item.item_title || "No Title"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <a href={`tel:${item.visitor_phone}`} className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-black transition-all">📞</a>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="px-6 py-20 text-center font-bold text-slate-300 uppercase italic">No Visitor Leads Found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}