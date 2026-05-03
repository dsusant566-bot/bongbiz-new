"use client";
import React from 'react';
import Link from 'next/link';

export default function AdminMaster() {
  const adminTools = [
    { title: "Manage Ads", desc: "Featured/Sold Out কন্ট্রোল করুন", link: "/admin-control", color: "bg-sky-500" },
    { title: "User Enquiries", desc: "ব্যবহারকারীদের ইনকোয়ারি দেখুন", link: "/admin-enquiries", color: "bg-emerald-600" },
    { title: "Sales Leads", desc: "হোয়াটসঅ্যাপ ও কল লিডস দেখুন", link: "/admin-leads", color: "bg-indigo-600" },
  ];

  const categories = [
    { name: "Resale", link: "/resale" },
    { name: "Wholesale", link: "/wholesale" },
    { name: "Property", link: "/property" },
    { name: "Services", link: "/services" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 text-center border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
            BONGO<span className="text-blue-600">BIZ</span> <span className="text-slate-700">ADMIN CENTRAL</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] mt-3 tracking-[0.3em]">Master Control Panel V1.0</p>
        </header>

        {/* Admin Tools - ৩টি কার্ডই যাতে পরিষ্কার দেখা যায় */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {adminTools.map((tool, index) => (
            <Link key={index} href={tool.link} className="group flex">
              <div className={`${tool.color} p-8 rounded-[2.5rem] shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 text-white w-full flex flex-col justify-between min-h-[220px]`}>
                <div>
                  <h2 className="text-2xl font-black uppercase mb-2 tracking-tight">{tool.title}</h2>
                  <p className="text-white/90 text-xs font-bold uppercase tracking-wider">{tool.desc}</p>
                </div>
                <div className="mt-6">
                  <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/30">
                    Open Tool →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick View Categories */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-8 w-2 bg-blue-600 rounded-full"></div>
            <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">
              Quick View Categories
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <Link key={index} href={cat.link} 
                className="flex items-center justify-center p-5 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all duration-300 font-black uppercase text-[11px] tracking-widest border border-slate-100 shadow-sm">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
            © 2026 BONGOBIZ | Efficiency in Management
          </p>
        </footer>
      </div>
    </div>
  );
}