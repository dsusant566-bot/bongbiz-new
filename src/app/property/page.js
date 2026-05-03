"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard"; // কার্ড কম্পোনেন্ট ইম্পোর্ট করা হলো

export default function PropertyPage() {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeSubCat, setActiveSubCat] = useState("All");

  const propertyCategories = ["All", "Flat", "House", "Shop", "Land", "PG", "Office"];

  useEffect(() => {
    fetchPropertyAds();
  }, []);

  const fetchPropertyAds = async () => {
    setLoading(true);
    try {
      const { data: ads, error } = await supabase
        .from("listings")
        .select("*")
        .or('category.eq.Property,category.eq.Real Estate')
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
      const filtered = data.filter(item => {
        const itemType = (item.item_type || "").toLowerCase();
        const subCategory = (item.sub_category || "").toLowerCase();
        const target = subCat.toLowerCase();
        return itemType.includes(target) || subCategory.includes(target);
      });
      setFilteredData(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* ব্যানার - PROPERTY HUB (আগের মতোই রাখা হয়েছে) */}
      <header className="relative w-full py-10 px-4 text-center overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1920&auto=format&fit=crop" 
          alt="Modern Real Estate" 
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic text-white tracking-tighter">
            <span className="text-[#22c55e]">PROPERTY</span> <span className="text-blue-400">HUB</span>
          </h1>
          <p className="mt-2 text-blue-100 font-bold italic tracking-widest uppercase text-[10px] md:text-xs">
            Buy & Sell with Trust • Find Your Dream Place
          </p>
          
          <div className="flex gap-4 mt-6">
            <Link href="/">
              <button className="bg-white text-[#003366] px-8 py-2.5 rounded-full font-black uppercase text-[9px] shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-105 border border-slate-100">
                Back to Home
              </button>
            </Link>
            <Link href="/enquiry">
              <button className="bg-[#22c55e] text-white px-8 py-2.5 rounded-full font-black uppercase text-[9px] shadow-lg hover:bg-black transition-all transform hover:scale-105">
                Send Enquiry
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ক্যাটাগরি মেনু */}
      <nav className="sticky top-0 z-40 bg-white border-b py-3 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-start md:justify-center items-center gap-2 min-w-max">
          {propertyCategories.map((sub) => (
            <button 
              key={sub}
              onClick={() => filterSubCategory(sub)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all
                ${activeSubCat === sub 
                  ? 'bg-[#22c55e] text-white shadow-md' 
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
          <div className="w-1.5 h-8 bg-[#22c55e] rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-[#22c55e]">FRESH</span> <span className="text-[#00a2ed]">PROPERTIES</span>
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
              <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">No Properties Found in this Category</p>
            </div>
          )}
        </div>
      </main>

      {/* ফুটার */}
      <footer className="py-10 text-center border-t border-gray-100">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
          © 2026 BONGOBIZ PROPERTY | Find Your Space
        </p>
      </footer>

    </div>
  );
}