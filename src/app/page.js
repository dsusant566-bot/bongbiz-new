"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient"; 
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAds() {
      try {
        const { data: ads, error } = await supabase
          .from("listings")
          .select("*")
          .eq('is_deleted', false)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setData(ads);
      } catch (err) {
        console.error("Supabase Error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, []);

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans text-black text-[14px]">
      
      {/* হিরো ব্যানার */}
      <div className="relative h-[200px] md:h-[250px] w-full overflow-hidden shadow-lg border-b-4 border-blue-500/20">
        <img 
          src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1600" 
          className="absolute inset-0 w-full h-full object-cover scale-105" 
          alt="Marketplace Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent backdrop-blur-[1px] flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            INDIA'S MOST TRUSTED <br/>
            <span className="text-blue-400">CLASSIFIED MARKETPLACE</span>
          </h1>
          <p className="text-white/90 text-[10px] md:text-sm font-bold mt-4 uppercase tracking-[0.15em] max-w-3xl border-t border-b border-white/20 py-2">
            Connecting Buyers with Sellers & Wholesalers to Retailers
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 py-12 space-y-16">

        {/* FRESH RECOMMENDATIONS */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-l-8 border-[#007bff] pl-4">
            <h2 className="text-2xl font-black tracking-tighter text-slate-800 uppercase italic">
              FRESH <span className="text-[#007bff]">RECOMMENDATIONS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border shadow-sm"></div>
              ))
            ) : data.length > 0 ? (
              data.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 py-20 font-bold uppercase italic border-2 border-dashed border-gray-200 rounded-[3rem]">No active ads found.</p>
            )}
          </div>
        </div>

        {/* ব্যানার সেকশন - আগের মতোই আছে */}
        <div className="space-y-10 pb-10">
          {/* Resale & Property */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[380px] rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white">
              <Link href="/resale" className="absolute inset-0 z-10"></Link>
              <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-0 p-12 flex flex-col justify-center space-y-4 z-30 text-white pointer-events-none">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">RESALE<br/>MARKETPLACE</h2>
                <p className="text-sm font-medium text-gray-100 max-w-sm">Upgrade your lifestyle by selling things you no longer need.</p>
              </div>
              <div className="absolute bottom-12 left-12 z-40">
                <Link href="/post-ad" className="bg-[#007bff] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-white hover:text-blue-600 transition-all text-xs uppercase tracking-widest no-underline">Post Free Ad</Link>
              </div>
            </div>

            <div className="relative h-[380px] rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white text-right">
              <Link href="/property" className="absolute inset-0 z-10"></Link>
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-0 p-12 flex flex-col justify-center items-end space-y-4 z-30 text-white pointer-events-none">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">PROPERTY &<br/>REAL ESTATE</h2>
                <p className="text-sm font-medium text-gray-100 max-w-sm">Find your dream home or investment land in West Bengal.</p>
              </div>
              <div className="absolute bottom-12 right-12 z-40 flex gap-4">
                <Link href="/enquiry" className="bg-white text-teal-900 px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-teal-500 hover:text-white transition-all relative z-40">Enquiry</Link>
                <Link href="/post-ad" className="bg-[#28a745] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-black transition-all relative z-40">Add Property</Link>
              </div>
            </div>
          </div>

          {/* Wholesale & Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[380px] rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white">
              <Link href="/wholesale" className="absolute inset-0 z-10"></Link>
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-0 p-12 flex flex-col justify-center space-y-4 z-30 text-white pointer-events-none">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">WHOLESALE &<br/>B2B HUB</h2>
                <p className="text-sm font-medium text-gray-100 max-w-sm">Connect directly with manufacturers and wholesalers.</p>
              </div>
              <div className="absolute bottom-12 left-12 z-40 flex gap-4">
                <Link href="/enquiry" className="bg-[#fd7e14] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-white hover:text-[#fd7e14] transition-all relative z-40">Get Price</Link>
                <Link href="/post-ad" className="bg-white text-orange-700 px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-orange-600 hover:text-white transition-all relative z-40">Bulk Sell</Link>
              </div>
            </div>

            <div className="relative h-[380px] rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white text-right">
              <Link href="/services" className="absolute inset-0 z-10"></Link>
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-0 p-12 flex flex-col justify-center items-end space-y-4 z-30 text-white pointer-events-none">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">EXPERTS &<br/>SERVICES</h2>
                <p className="text-sm font-medium text-gray-100 max-w-sm">Everything is just a click away. Scale your vision with experts.</p>
              </div>
              <div className="absolute bottom-12 right-12 z-40 flex gap-4">
                <Link href="/enquiry" className="bg-[#6f42c1] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-white hover:text-[#6f42c1] transition-all relative z-40">Request Quote</Link>
                <Link href="/post-ad" className="bg-white text-purple-700 px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-purple-600 hover:text-white transition-all relative z-40">Offer Service</Link>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}