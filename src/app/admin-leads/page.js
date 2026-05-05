"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLeadsPage() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || currentUser.email !== "dsusant566@gmail.com") {
        router.push("/");
      } else {
        setUser(currentUser);
        fetchLeads();
      }
    };
    checkUser();
  }, [router]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('visitor_leads').select('*').order('created_at', { ascending: false });
    if (!error) setLeads(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("চিরতরে ডিলিট করতে চান?")) {
      await supabase.from('visitor_leads').delete().eq('id', id);
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8">Visitor <span className="text-[#ff6600]">Leads</span></h1>
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white uppercase text-[10px]">
              <tr><th className="p-5">তারিখ</th><th className="p-5">নাম</th><th className="p-5">ফোন</th><th className="p-5">অ্যাকশন</th></tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="p-5 text-[11px]">{new Date(l.created_at).toLocaleDateString()}</td>
                  <td className="p-5 font-black uppercase">{l.visitor_name}</td>
                  <td className="p-5 text-[#00a2ed] font-bold">{l.visitor_phone}</td>
                  <td className="p-5"><button onClick={() => handleDelete(l.id)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}