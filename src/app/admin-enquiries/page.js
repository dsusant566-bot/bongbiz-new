"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEnquiries(data);
    } catch (err) {
      console.error("Error fetching enquiries:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // ডিলিট ফাংশন
  const handleDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই ইনকোয়ারিটি মুছে ফেলতে চান?")) {
      try {
        const { error } = await supabase.from('enquiries').delete().eq('id', id);
        if (error) throw error;
        setEnquiries(enquiries.filter(item => item.id !== id));
        alert("ইনকোয়ারি সফলভাবে মুছে ফেলা হয়েছে।");
      } catch (err) {
        alert("ভুল হয়েছে: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-black uppercase tracking-widest text-slate-400">Loading Enquiries...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="border-l-8 border-[#7B00FF] pl-4">
            <h1 className="text-3xl font-black uppercase italic text-slate-800">Business <span className="text-[#7B00FF]">Enquiries</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">BongoBiz Admin Panel</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-purple-100">
            <span className="text-sm font-black text-slate-500 uppercase">Total Enquiries: </span>
            <span className="text-xl font-black text-[#7B00FF]">{enquiries.length}</span>
          </div>
        </div>

        {/* টেবিল সেকশন */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                  <th className="px-6 py-5 font-black">Date</th>
                  <th className="px-6 py-5 font-black">Customer Info</th>
                  <th className="px-6 py-5 font-black">Service Type</th>
                  <th className="px-6 py-5 font-black">Requirement</th>
                  <th className="px-6 py-5 font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.length > 0 ? (
                  enquiries.map((item) => (
                    <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <p className="text-[11px] font-black text-slate-400 uppercase">{new Date(item.created_at).toLocaleDateString('en-IN')}</p>
                        <p className="text-[9px] font-bold text-purple-400 italic">{new Date(item.created_at).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-black text-slate-800 uppercase text-xs">{item.name}</p>
                        <p className="text-[11px] font-bold text-blue-600">{item.phone}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.email || "No Email"}</p>
                        <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase italic">📍 {item.address}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-purple-100 text-[#7B00FF] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border border-purple-200">
                          {item.service_type}
                        </span>
                        <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase italic">{item.occupation}</p>
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        <p className="text-[11px] font-black text-slate-700 uppercase leading-tight mb-1">{item.requirement}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-2 italic">{item.description}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <a 
                            href={`tel:${item.phone}`} 
                            className="inline-flex items-center justify-center w-10 h-10 bg-[#7B00FF] text-white rounded-xl shadow-lg hover:bg-black transition-all"
                          >
                            📞
                          </a>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-all"
                            title="Delete Enquiry"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center font-bold text-slate-300 uppercase tracking-widest italic">No Enquiries Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}