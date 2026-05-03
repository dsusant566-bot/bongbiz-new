"use client";
import React, { useState, useEffect } from 'react';

export default function ImageGallery({ ad }) {
  // ১. EMPTY বা ভুল লিঙ্কগুলো ফিল্টার করে আসল ছবির লিস্ট তৈরি
  const imageUrls = [
    ad?.image_url_1,
    ad?.image_url_2,
    ad?.image_url_3,
    ad?.image_url_4
  ].filter(img => img && img !== "EMPTY" && img.trim() !== "");

  // ২. স্টেট শুরুতে null রাখা হয়েছে যাতে খালি স্ট্রিং এরর না আসে
  const [selectedImage, setSelectedImage] = useState(null);

  // ৩. অ্যাড লোড হওয়ার পর প্রথম ছবিটিকে ডিফল্ট হিসেবে সেট করা
  useEffect(() => {
    if (imageUrls.length > 0) {
      setSelectedImage(imageUrls[0]);
    }
  }, [ad]);

  return (
    <div className="flex flex-col gap-4">
      {/* বড় ছবি ডিসপ্লে সেকশন */}
      <div className="bg-gray-50 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white aspect-video flex items-center justify-center relative">
        {/* কন্ডিশনাল রেন্ডারিং: লিঙ্ক থাকলে তবেই img ট্যাগ দেখাবে, নাহলে এরর দেবে না */}
        {selectedImage ? (
          <img 
            src={selectedImage} 
            className="w-full h-full object-contain p-6 transition-all duration-500" 
            alt="Product View" 
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Loading Image...</p>
          </div>
        )}
      </div>

      {/* ছোট থাম্বনেইল লিস্ট - যদি ১টার বেশি ছবি থাকে তবেই দেখাবে */}
      {imageUrls.length > 1 && (
        <div className="flex gap-3 px-2 overflow-x-auto pb-4 no-scrollbar">
          {imageUrls.map((img, index) => (
            <div 
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 rounded-2xl border-2 cursor-pointer overflow-hidden flex-shrink-0 transition-all duration-300 ${
                selectedImage === img 
                ? "border-blue-600 scale-105 shadow-lg ring-2 ring-blue-100" 
                : "border-white shadow-sm hover:border-blue-200"
              }`}
            >
              <img 
                src={img} 
                className="w-full h-full object-cover" 
                alt={`Thumbnail ${index + 1}`} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}