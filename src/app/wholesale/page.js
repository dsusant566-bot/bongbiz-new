"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard"; // মাস্টার কার্ড কম্পোনেন্ট

export default function WholesalePage() {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeSubCat, setActiveSubCat] = useState("All");

  const wholesaleCategories = [
    "All", 
    "Construction & Industrial", 
    "Garments & Textile", 
    "FMCG & Grocery", 
    "Electronics & Gadgets", 
    "Agriculture", 
    "Others"
  ];

  useEffect(() => {
    fetchWholesaleAds();
  }, []);

  const fetchWholesaleAds = async () => {
    setLoading(true);
    try {
      const { data: ads, error } = await supabase
        .from("listings")
        .select("*")
        .eq("category", "Wholesale") 
        .eq("is_deleted", false)  
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(ads);
      setFilteredData(ads);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterSubCategory = (subCat) => {
    setActiveSubCat(subCat);
    if (subCat === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => 
        (item.sub_category || "").toLowerCase().trim() === subCat.toLowerCase().trim()
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* ব্যানার - WHOLESALE B2B HUB */}
      <header className="relative w-full py-10 px-4 text-center overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1920&auto=format&fit=crop" 
          alt="Wholesale B2B" 
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40 blur-[2px]"
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic text-white tracking-tighter">
            <span className="text-[#ff6600]">WHOLESALE</span> <span className="text-blue-400">B2B HUB</span>
          </h1>
          <p className="mt-2 text-yellow-400 font-bold italic tracking-widest uppercase text-[10px] md:text-xs">
            "Bulk Machines, Tools & Spare Parts at Wholesale Rates"
          </p>
          
          <div className="flex gap-4 mt-6">
            <Link href="/">
              <button className="bg-white text-[#003366] px-8 py-2.5 rounded-full font-black uppercase text-[9px] shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-105 border border-slate-100">
                Back to Home
              </button>
            </Link>
            
            <Link href="/enquiry">
              <button className="bg-[#ff6600] text-white px-8 py-2.5 rounded-full font-black uppercase text-[9px] shadow-lg hover:bg-black transition-all transform hover:scale-105">
                Send Enquiry
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* সাব-ক্যাটাগরি মেনু */}
      <nav className="sticky top-0 z-40 bg-white border-b py-3 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-start md:justify-center items-center gap-2 min-w-max">
          {wholesaleCategories.map((sub) => (
            <button 
              key={sub}
              onClick={() => filterSubCategory(sub)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all
                ${activeSubCat === sub 
                  ? 'bg-[#ff6600] text-white shadow-md' 
                  : 'bg-gray-100 text-[#001f3f] hover:bg-gray-200'
                }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 py-10">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-[#ff6600] rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-[#ff6600]">FRESH</span> <span className="text-[#00a2ed]">WHOLESALE DEALS</span>
          </h2>
        </div>

        {/* ৫-কলাম গ্রিড - এখানে এখন ProductCard ব্যবহার করা হয়েছে */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            // লোডিং স্কেলিটন
            [...Array(10)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-[2rem] animate-pulse"></div>
            ))
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 border-2 border-dashed rounded-[3rem]">
              <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">No Wholesale Items Found</p>
            </div>
          )}
        </div>
      </main>

      {/* ফুটার */}
      <footer className="py-10 text-center border-t border-gray-100 mt-10">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
          © 2026 BONGOBIZ WHOLESALE | Direct B2B Connection
        </p>
      </footer>

    </div>
  );
}