"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminMaster() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || currentUser.email !== "dsusant566@gmail.com") {
        router.push("/");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="p-10 text-center font-bold">Checking Access...</div>;
  if (!user) return null;

  const adminTools = [
    { title: "Manage Ads", desc: "Featured/Sold Out কন্ট্রোল করুন", link: "/admin-control", color: "bg-sky-500" },
    { title: "User Enquiries", desc: "ব্যবহারকারীদের ইনকোয়ারি দেখুন", link: "/admin-enquiries", color: "bg-emerald-600" },
    { title: "Sales Leads", desc: "হোয়াটসঅ্যাপ ও কল লিডস দেখুন", link: "/admin-leads", color: "bg-indigo-600" },
  ];

  const categories = [ { name: "Resale", link: "/resale" }, { name: "Wholesale", link: "/wholesale" }, { name: "Property", link: "/property" }, { name: "Services", link: "/services" } ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
            BONGO<span className="text-blue-600">BIZ</span> <span className="text-slate-700">ADMIN CENTRAL</span>
          </h1>
          <p className="text-blue-600 text-[10px] font-bold mt-1 uppercase">LOGGED IN AS: {user.email}</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {adminTools.map((tool, index) => (
            <Link key={index} href={tool.link} className="group flex">
              <div className={`${tool.color} p-8 rounded-[2.5rem] shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 text-white w-full flex flex-col justify-between min-h-[220px]`}>
                <div><h2 className="text-2xl font-black uppercase mb-2">{tool.title}</h2><p className="text-white/90 text-xs font-bold uppercase">{tool.desc}</p></div>
                <div className="mt-6"><span className="bg-white/20 px-5 py-2 rounded-full text-[10px] font-black uppercase">Open Tool →</span></div>
              </div>
            </Link>
          ))}
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <Link key={index} href={cat.link} className="flex items-center justify-center p-5 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all font-black uppercase text-[11px] border shadow-sm">{cat.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}