"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminMaster() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // সিকিউরিটি লজিক: ইমেইল না মিললে হোম পেজে পাঠিয়ে দেবে
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session && session.user.email !== "dsusant566@gmail.com") {
      router.push("/");
    }
  }, [status, session, router]);

  // লোডিং বা ভুল ইউজার হলে কিছু দেখাবে না
  if (status === "loading") return <div className="p-10 text-center font-black uppercase text-xs tracking-widest">Checking Access...</div>;
  if (!session || session.user.email !== "dsusant566@gmail.com") return null;

  const adminTools = [
    { title: "Manage Ads", desc: "Featured/Sold Out কন্ট্রোল করুন", link: "/admin-control", color: "bg-sky-500" },
    { title: "User Enquiries", desc: "ব্যবহারকারীদের ইনকোয়ারি দেখুন", link: "/admin-enquiries", color: "bg-emerald-600" },
    { title: "Sales Leads", desc: "হোয়াটসঅ্যাপ ও কল লিডস দেখুন", link: "/admin-leads", color: "bg-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 text-center border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
            BONGO<span className="text-blue-600">BIZ</span> <span className="text-slate-700">ADMIN</span>
          </h1>
          <p className="text-blue-600 text-[10px] font-bold mt-3 uppercase tracking-widest">
            Logged in as: {session.user.email}
          </p>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool, index) => (
            <Link key={index} href={tool.link} className="group">
              <div className={`${tool.color} p-8 rounded-[2.5rem] shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 text-white min-h-[200px] flex flex-col justify-between`}>
                <div>
                  <h2 className="text-2xl font-black uppercase mb-2 tracking-tight">{tool.title}</h2>
                  <p className="text-white/90 text-[10px] font-bold uppercase tracking-wider">{tool.desc}</p>
                </div>
                <div className="mt-6">
                  <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black tracking-widest uppercase border border-white/30">
                    Open Tool →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-20 text-center">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.5em]">
            © 2026 BONGOBIZ | Administrative Control
          </p>
        </footer>
      </div>
    </div>
  );
}