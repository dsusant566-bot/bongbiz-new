"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import Link from 'next/link';

export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlistItems();
  }, []);

  const fetchWatchlistItems = async () => {
    setLoading(true);
    // ১. লোকাল স্টোরেজ থেকে সেভ করা আইডিগুলো নিন
    const savedIds = JSON.parse(localStorage.getItem('watchlist') || '[]');

    if (savedIds.length > 0) {
      // ২. সুপাবেস থেকে শুধু ওই আইডিগুলোর অ্যাড নিয়ে আসুন
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .in('id', savedIds)
        .eq('is_deleted', false);

      if (!error) setItems(data);
    }
    setLoading(false);
  };

  // ওয়াচলিস্ট থেকে রিমুভ করার ফাংশন
  const removeItem = (id) => {
    const savedIds = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const updatedIds = savedIds.filter(itemId => itemId !== id);
    localStorage.setItem('watchlist', JSON.stringify(updatedIds));
    
    // স্ক্রিন থেকে সাথে সাথে সরানোর জন্য
    setItems(items.filter(item => item.id !== id));
    
    // হেডার কাউন্ট আপডেট করার জন্য ইভেন্ট পাঠান
    window.dispatchEvent(new Event('watchlistUpdated'));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 uppercase italic mb-8 border-l-8 border-red-500 pl-4">
          My <span className="text-red-500">Watchlist</span> ❤️
        </h1>

        {loading ? (
          <div className="py-20 text-center font-black text-blue-600 animate-pulse uppercase tracking-widest">
            Loading your favorites...
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group relative">
                {/* রিমুভ বাটন */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md text-red-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-all"
                  title="Remove from watchlist"
                >
                  ✕
                </button>

                <Link href={`/item/${item.id}`}>
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      src={item.image_url_1} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-black uppercase text-blue-500 mb-1">{item.category}</p>
                    <h2 className="text-lg font-black text-slate-800 uppercase leading-tight line-clamp-1">{item.title}</h2>
                    <p className="text-2xl font-black text-[#7B00FF] mt-3">₹{item.price}</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-gray-400">
                       <span>📍 {item.district}</span>
                       <span className="bg-slate-100 px-3 py-1 rounded-full uppercase">View Details →</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] shadow-inner border border-dashed border-gray-200">
            <p className="text-4xl mb-4">🧊</p>
            <p className="text-gray-400 font-black uppercase tracking-widest">Your watchlist is empty!</p>
            <Link href="/" className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase hover:bg-black transition-all shadow-lg">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}