"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard"; // কার্ড কম্পোনেন্ট ব্যবহার করা হলো

export default function ResalePage() {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeSubCat, setActiveSubCat] = useState("All");

  const resaleCategories = ["All", "Vehicles", "Electronics", "Home Appliances", "Furniture", "Hobbies & Fashion", "Others"];

  useEffect(() => {
    fetchResaleAds();
  }, []);

  const fetchResaleAds = async () => {
    setLoading(true);
    try {
      const { data: ads, error } = await supabase
        .from("listings")
        .select("*")
        .eq("category", "Resale") 
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
        (item.sub_category || "").toLowerCase() === subCat.toLowerCase()
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* ব্যানার সেকশন - আপনার দেওয়া অরিজিনাল ডিজাইন */}
      <header className="relative w-full py-10 px-4 text-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop" 
          alt="Marketplace" 
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40"
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic text-[#003366] tracking-tighter">
            RESALE <span className="text-[#00a2ed]">HUB</span>
          </h1>
          
          <p className="mt-2 text-[#003366] font-bold italic tracking-widest uppercase text-[10px] md:text-xs">
            Buy & Sell with Trust • Best Deals Guaranteed
          </p>

          <div className="flex gap-4 mt-6">
            <Link href="/">
              <button className="bg-white text-[#003366] px-8 py-2.5 rounded-full font-black uppercase text-[9px] shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-105 border border-slate-100">
                Back to Home
              </button>
            </Link>
            
            <Link href="/enquiry">
              <button className="bg-[#7B00FF] text-white px-8 py-2.5 rounded-full font-black uppercase text-[9px] shadow-lg hover:bg-black transition-all transform hover:scale-105">
                Send Enquiry
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* সাব-ক্যাটাগরি মেনু */}
      <nav className="sticky top-0 z-40 bg-white border-b py-3 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-start md:justify-center items-center gap-2 min-w-max">
          {resaleCategories.map((sub) => (
            <button 
              key={sub}
              onClick={() => filterSubCategory(sub)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all
                ${activeSubCat === sub 
                  ? 'bg-[#00a2ed] text-white shadow-md' 
                  : 'bg-gray-100 text-[#001f3f] hover:bg-gray-200'
                }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 py-10">
        
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-8 bg-[#00a2ed] rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-[#003366]">FRESH</span> <span className="text-[#00a2ed]">RECOMMENDATIONS</span>
          </h2>
        </div>

        {/* গ্রিড সেকশন - এখানে ProductCard ব্যবহার করা হয়েছে যাতে Watchlist/Featured/Sold সব দেখা যায় */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {loading ? (
            <div className="col-span-full text-center py-20 font-bold text-blue-600 animate-pulse text-[9px] uppercase">Loading...</div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-300 font-bold text-xs uppercase tracking-widest">
              No Items Found In This Category
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 text-center border-t border-gray-100 mt-10 font-bold text-[#003366] text-[10px] uppercase tracking-widest">
        © 2026 BongoBiz Marketplace
      </footer>
    </div>
  );
}