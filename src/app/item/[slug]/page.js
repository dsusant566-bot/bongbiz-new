"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import ContactLeadForm from "../../../components/ContactLeadForm";
import ImageGallery from "@/components/ImageGallery";
import WatchListButton from "@/components/WatchListButton";
import { getIdFromSlug } from "@/lib/utils"; 
// আপনার সেই অরিজিনাল ইমপোর্ট, যা আমি আগে সরিয়েছিলাম, তা আবার যোগ করা হলো
import { unstable_isUnrecognizedActionError } from 'next/dist/client/components/navigation.react-server';

export default function AdDetails({ params }) {
  const [ad, setAd] = useState(null);
  const [similarAds, setSimilarAds] = useState([]);
  const [loading, setLoading] = useState(true);
  // পপ-আপের জন্য ২টো নতুন স্টেট যোগ করা হলো, যা আপনার পুরনো কোডে ছিল না
  const [showModal, setShowModal] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const resolvedParams = await params;
        const rawSlug = resolvedParams.slug;
        const idFromSlug = getIdFromSlug(rawSlug);

        const { data: adData, error: adError } = await supabase
          .from("listings")
          .select("*")
          .eq("id", idFromSlug)
          .single();

        if (adError || !adData) throw adError;
        setAd(adData);
        // মেইন পেজ লোড হলে প্রথম ছবিটা সেভ হবে পপ-আপের জন্য
        setActiveImage(adData.image_url_1);

        const { data: similarData } = await supabase
          .from("listings")
          .select("id, title, price, image_url_1")
          .eq("category", adData.category)
          .eq("is_deleted", false)
          .neq("id", adData.id)
          .limit(4);

        setSimilarAds(similarData || []);
      } catch (err) {
        console.error("Error fetching ad details:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  if (loading) {
    return <div className="p-20 text-center font-bold text-blue-600 animate-pulse uppercase tracking-widest text-[10px]">Loading Ad Details...</div>;
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
        <p className="text-red-500 font-black uppercase text-xl mb-4">AD NOT FOUND!</p>
        <a href="/" className="bg-[#007bff] text-white px-6 py-2 rounded-full font-bold text-xs uppercase shadow-lg">Back to Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* Schema Markup for SEO - হুবহু আগের মতোই আছে */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": ad.title,
            "image": [ad.image_url_1, ad.image_url_2].filter(img => img && img !== "EMPTY"),
            "description": ad.description,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": ad.price,
              "availability": ad.is_sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
            }
          })
        }}
      />

      {/* Blue Search Bar Area - একদম অরিজিনাল */}
      <div className="w-full bg-[#007bff] p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center bg-white/20 backdrop-blur-md rounded-full px-5 py-3 border border-white/30">
          <span className="text-white mr-3">🔍</span>
          <input 
            type="text" 
            readOnly
            value={ad.title} 
            className="bg-transparent w-full text-white font-black uppercase outline-none border-none text-[9px] md:text-sm tracking-widest overflow-hidden text-ellipsis"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-10">
        
        {/* ক্যাটাগরি ও ম্যাপ লিঙ্ক - সাইজ রেসপনসিভ করা হয়েছে যাতে ফোনে সুন্দর লাগে */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center bg-[#00a2ed] rounded-full overflow-hidden shadow-md">
             <span className="text-[9px] md:text-[10px] font-black uppercase text-white px-4 py-2.5 border-r border-white/20">
                {ad.category}
             </span>
             <span className="text-[9px] md:text-[10px] font-black uppercase text-white px-4 py-2.5 bg-blue-600">
                {ad.item_type}
             </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase text-slate-600 bg-slate-50 px-5 py-2.5 rounded-full border border-gray-200">
            <span className="text-sm">📍</span> 
            <span>{ad.location}, {ad.district}</span>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ad.location + ' ' + ad.district + ' West Bengal')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black hover:bg-blue-600 hover:text-white transition-all uppercase tracking-tighter"
            >
              View Map 📍
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           <div className="lg:col-span-2">
             {/* 이미지 গ্যালারিতে onImageClick যোগ করা হলো পপ-আপের জন্য */}
             <div className="relative">
               <ImageGallery 
                 ad={ad} 
                 onImageClick={(clickedImage) => {
                   setActiveImage(clickedImage);
                   setShowModal(true);
                 }} 
               />
               {ad.is_sold && (
                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[1px] rounded-[2rem] pointer-events-none">
                   <div className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-3xl md:text-6xl uppercase shadow-2xl border-2 border-white tracking-tighter -rotate-12 scale-110">
                     SOLD OUT
                   </div>
                 </div>
               )}
             </div>

             {/* Description - লেখা রেসপনসিভ করা হয়েছে */}
             <div className="mt-8 bg-slate-50 rounded-[3rem] p-6 md:p-8 shadow-inner border border-gray-100">
               <h2 className="text-lg md:text-2xl font-black uppercase italic border-l-8 border-[#007bff] pl-4 mb-4">Description</h2>
               <p className="font-bold text-slate-700 whitespace-pre-wrap leading-relaxed text-xs md:text-sm">{ad.description}</p>
             </div>

             {/* Safety Tips for Buyers - একদম অরিজিনাল */}
             <div className="mt-8 p-6 md:p-8 rounded-[3rem] border-2 border-dashed border-orange-200 bg-orange-50">
                <h3 className="text-[10px] md:text-sm font-black uppercase text-orange-600 mb-3 italic">Safety Tips for Buyers</h3>
                <ul className="text-[9px] md:text-[11px] font-bold text-slate-600 space-y-2 list-disc pl-5">
                   <li>Meet the seller at a safe public location.</li>
                   <li>Inspect the item thoroughly before paying.</li>
                   <li>Avoid advance payments without seeing the product.</li>
                </ul>
             </div>
           </div>
           
           <div className="space-y-6">
              {/* স্টিকি প্যানেল - প্যাডিং ও ফন্ট ফোনের জন্য রেসপনসিভ */}
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-gray-100 h-fit lg:sticky lg:top-24">
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {ad.is_featured && (
                      <span className="bg-yellow-400 text-black px-4 md:px-5 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase italic tracking-wider shadow-sm">
                        ⭐ Premium Featured
                      </span>
                    )}
                    {ad.is_sold && (
                      <span className="bg-red-600 text-white px-4 md:px-5 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase italic tracking-wider shadow-sm">
                        🚫 Sold Out
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl md:text-3xl font-black uppercase italic leading-tight text-slate-900">{ad.title}</h1>
                  
                  <div className="flex items-center justify-between my-6 md:my-8">
                    <div className="text-3xl md:text-5xl font-black text-[#7B00FF] tracking-tighter">₹{ad.price}</div>
                    <WatchListButton adId={ad.id} />
                  </div>
                  
                  {!ad.is_sold ? (
                    <div className="flex flex-col gap-4 mt-6">
                      <ContactLeadForm ad={ad} mode="full-call" />
                      <ContactLeadForm ad={ad} mode="full-whatsapp" />
                    </div>
                  ) : (
                    <div className="mt-6 p-6 md:p-8 bg-red-50 border-2 border-red-100 rounded-[2rem] text-center">
                      <p className="text-red-600 font-black uppercase italic text-[10px] md:text-sm">Product No Longer Available</p>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-center gap-4">
                     <button title="Share" className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all text-xs">👥</button>
                     <button title="Link" className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-800 hover:text-white transition-all text-xs">🔗</button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase text-slate-400">
                      <span>Ad ID:</span>
                      <span className="text-slate-900">{ad.id.split('-')[0]}</span>
                    </div>
                    <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase text-slate-400">
                      <span>Posted Date:</span>
                      <span className="text-slate-900">{new Date(ad.created_at).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 border-2 border-red-100 text-red-400 text-[8px] md:text-[9px] font-black uppercase rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all">
                    🚩 Report This Ad
                  </button>
              </div>
           </div>
        </div>

        {/* Similar Ads Section - একদম অরিজিনাল */}
        {similarAds && similarAds.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h2 className="text-lg md:text-2xl font-black uppercase italic mb-8 border-l-8 border-blue-600 pl-4">Similar Recommendations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {similarAds.map((item) => (
                <a href={`/item/${item.id}`} key={item.id} className="group">
                  <div className="bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg group-hover:shadow-2xl transition-all">
                    <div className="aspect-square bg-white flex items-center justify-center p-3 md:p-4">
                      <img src={item.image_url_1} className="w-full h-full object-contain group-hover:scale-105 transition-transform" alt={item.title} />
                    </div>
                    <div className="p-4 md:p-5">
                      <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 truncate">{item.title}</p>
                      <p className="text-base md:text-lg font-black text-blue-600">₹{item.price}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ইমেজ পপ-আপ মডেল (Modal) - এটি একটি নতুন সংযোজন, যা আপনার পুরনো ডিজাইনে ছিল না */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <button className="absolute top-4 right-4 text-white text-4xl font-light">×</button>
            <img 
              src={activeImage} 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl transition-transform duration-300" 
              alt="Ad Large Preview" 
            />
          </div>
        </div>
      )}
    </div>
  );
}