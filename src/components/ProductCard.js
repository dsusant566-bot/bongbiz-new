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

  // সর্টিং লজিক: Featured হলে -1 (সবার আগে), Sold Out হলে 1 (সবার পরে), বাকিরা 0
  const orderStyle = item.is_featured ? -1 : item.is_sold ? 1 : 0;

  return (
    <div 
      style={{ order: orderStyle }} // এই লাইনটি কার্ডের সিরিয়াল ঠিক করবে
      className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-blue-50 flex flex-col h-full relative"
    >
      
      {/* Featured/Sold Out - z-10 */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
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

      {/* Watchlist - z-10 */}
      <div className="absolute top-4 right-4 z-10">
        <WatchListButton adId={item.id} />
      </div>

      {/* কার্ডের পুরো লিঙ্ক - z-index মাত্র ৫ */}
      <Link href={itemPath} className="absolute inset-0 z-[5]"></Link>

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
        
        {/* লোকেশন সেকশন */}
        <div className="flex items-center justify-center text-gray-500 mb-4">
          <span className="mr-1 text-[#ff4d4d]">📍</span>
          <p className="text-[12px] font-semibold text-center leading-tight">
            {item.location}, {item.district}{item.state ? `, ${item.state}` : ""}
          </p>
        </div>
        
        {/* বাটন সেকশন - এখানে overflow-visible রাখা হয়েছে যাতে বাটন ঠিকমতো কাজ করে */}
<div className="mt-auto pt-4 border-t border-blue-50 flex items-center justify-between overflow-visible">
  
  <div className="flex flex-col shrink-0">
    <span className="text-[8px] font-black text-blue-300 uppercase italic leading-none mb-1">RECENT AD</span>
    <Link href={itemPath} className="text-[9px] font-black text-slate-400 uppercase hover:text-black leading-none">VIEW DETAILS</Link>
  </div>

  {/* বাটন কন্টেনার - এখানে relative z-[10] আর pointer-events-auto দিলে মোবাইলে টাচ কাজ করবেই */}
  <div className="flex items-center gap-2 shrink-0 relative z-[10] pointer-events-auto">
     {!item.is_sold && (
       <>
         <ContactLeadForm ad={item} mode="call" />
         <ContactLeadForm ad={item} mode="whatsapp" />
       </>
     )}
  </div>

</div>
      </div>
    </div>
  );
}