"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminEnquiriesPage() {
  const [user, setUser] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- সিকিউরিটি চেক: শুধুমাত্র আপনি এক্সেস পাবেন ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || currentUser.email !== "dsusant566@gmail.com") {
        router.push("/");
      } else {
        setUser(currentUser);
        fetchEnquiries();
      }
    };
    checkUser();
  }, [router]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enquiries') // আপনার টেবিলের নাম অনুযায়ী চেক করে নেবেন
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data);
    } catch (err) {
      console.error("Error fetching enquiries:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই ইনকোয়ারিটি ডিলিট করতে চান?")) {
      try {
        const { error } = await supabase.from('enquiries').delete().eq('id', id);
        if (error) throw error;
        setEnquiries(enquiries.filter(item => item.id !== id));
        alert("সফলভাবে ডিলিট হয়েছে।");
      } catch (err) {
        alert("ডিলিট করতে সমস্যা হয়েছে: " + err.message);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic">
              User <span className="text-[#00a2ed]">Enquiries</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              সরাসরি আসা জিজ্ঞাসার তালিকা
            </p>
          </div>
          <button 
            onClick={fetchEnquiries}
            className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black shadow-sm border hover:bg-slate-50"
          >
            REFRESH
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-black text-[#00a2ed] animate-pulse uppercase">Loading Enquiries...</div>
        ) : enquiries.length > 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                    <th className="p-5">তারিখ</th>
                    <th className="p-5">নাম</th>
                    <th className="p-5">ফোন / ইমেল</th>
                    <th className="p-5">মেসেজ</th>
                    <th className="p-5 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-sm">
                  {enquiries.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-5 text-[11px] font-bold text-slate-400">
                        {new Date(item.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-5 font-black text-slate-900 uppercase italic">{item.name}</td>
                      <td className="p-5 font-bold text-[#00a2ed]">{item.contact_info || item.email || item.phone}</td>
                      <td className="p-5 text-slate-500 max-w-xs truncate">{item.message}</td>
                      <td className="p-5 text-center">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] text-slate-300 font-bold uppercase italic">
            No Enquiries Found
          </div>
        )}
      </div>
    </div>
  );
}