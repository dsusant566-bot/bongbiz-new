"use client";
import React from 'react';
import Link from 'next/link';
import ContactLeadForm from "@/components/ContactLeadForm";
import WatchListButton from "@/components/WatchListButton";

export default function ProductCard({ item }) {
  const getSlug = (item) => {
    const clean = (text) => (text || "").toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const title = clean(item.title);
    const itype = clean(item.item_type);
    const location = clean(item.location);
    const district = clean(item.district);
    const state = clean(item.state || "west-bengal");
    const id = item.id;
    return `/item/${title}-${itype}-${location}-${district}-${state}-india-${id}`;
  };

  const itemPath = getSlug(item);
  const orderStyle = item.is_featured ? -1 : item.is_sold ? 1 : 0;

  return (
    <div 
      style={{ order: orderStyle }} 
      className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-blue-50 flex flex-col h-full relative"
    >
      
      {/* Featured/Sold Out - z-index কমিয়ে ২ করা হলো */}
      <div className="absolute top-4 left-4 z-[2] flex flex-col gap-2">
        {item.is_featured && (
          <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
            ⭐ Featured
          </span>
        )}
        {item.is_sold && (
          <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
            🚫 Sold Out
          </span>
        )}
      </div>

      {/* Watchlist (লাভ চিহ্ন) - z-index কমিয়ে ৩ করা হলো */}
      <div className="absolute top-4 right-4 z-[3]">
        <WatchListButton adId={item.id} />
      </div>

      {/* কার্ডের পুরো লিঙ্ক - z-index ১ রাখা হয়েছে */}
      <Link href={itemPath} className="absolute inset-0 z-[1]"></Link>

      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <img 
          src={item.image_url_1 || "https://via.placeholder.com/400x300"} 
          alt={item.title} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.is_sold ? 'grayscale opacity-70' : ''}`} 
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-2xl font-black text-[#0056b3] mb-1 text-center">₹ {item.price}</p>
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 uppercase mb-2 tracking-tight text-center">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-center text-gray-500 mb-4">
          <span className="mr-1 text-[#ff4d4d]">📍</span>
          <p className="text-[12px] font-semibold text-center leading-tight">
            {item.location}, {item.district}{item.state ? `, ${item.state}` : ""}
          </p>
        </div>
        
        {/* বাটন সেকশন - z-index কমিয়ে ৪ করা হলো */}
        <div className="mt-auto pt-4 border-t border-blue-100 flex items-center justify-between relative z-[4]">
          <span className="text-[10px] font-black text-blue-300 uppercase tracking-tighter italic shrink-0">
            {item.is_sold ? "OUT OF STOCK" : "RECENT AD"}
          </span>
          
          <div className="flex items-center gap-1.5 flex-nowrap">
             <Link 
               href={itemPath} 
               className="bg-slate-100 text-slate-500 px-2 py-1.5 rounded-xl text-[9px] font-black uppercase hover:bg-black hover:text-white transition-all shadow-sm shrink-0"
             >
               VIEW
             </Link>
             
             {!item.is_sold && (
               <div className="flex items-center gap-1.5 shrink-0">
                  {/* কন্টাক্ট বাটনগুলোর z-index ৩ রাখা হলো */}
                  <div className="relative z-[3]">
                    <ContactLeadForm ad={item} mode="call" />
                  </div>
                  <div className="relative z-[3]">
                    <ContactLeadForm ad={item} mode="whatsapp" />
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}