"use client";
import React, { useState, useEffect } from 'react';

export default function ImageGallery({ ad, onImageClick }) {
  // ১. ইমেজ লিঙ্কগুলো ফিল্টার করা হচ্ছে
  const imageUrls = [
    ad?.image_url_1,
    ad?.image_url_2,
    ad?.image_url_3,
    ad?.image_url_4
  ].filter(img => img && img !== "EMPTY" && img.trim() !== "");

  const [selectedImage, setSelectedImage] = useState(null);

  // ২. প্রথম ছবি সেট করা
  useEffect(() => {
    if (imageUrls.length > 0) {
      setSelectedImage(imageUrls[0]);
    }
  }, [ad]);

  return (
    <div className="flex flex-col gap-4">
      {/* বড় ছবি ডিসপ্লে সেকশন - এখানে ক্লিক করলে পপ-আপ খুলবে */}
      <div 
        className="bg-gray-50 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white aspect-square md:aspect-video flex items-center justify-center relative cursor-zoom-in"
        onClick={() => selectedImage && onImageClick(selectedImage)} // এখানে মেইন ফাংশনটি কল করা হলো
      >
        {selectedImage ? (
          <img 
            src={selectedImage} 
            className="w-full h-full object-contain p-4 md:p-6 transition-all duration-500" 
            alt="Product View" 
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Loading Image...</p>
          </div>
        )}
      </div>

      {/* ছোট থাম্বনেইল লিস্ট */}
      {imageUrls.length > 1 && (
        <div className="flex gap-3 px-2 overflow-x-auto pb-4 no-scrollbar">
          {imageUrls.map((img, index) => (
            <div 
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // থাম্বনেইলে ক্লিক করলে যেন পপ-আপ না খুলে যায়
                setSelectedImage(img);
              }}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 cursor-pointer overflow-hidden flex-shrink-0 transition-all duration-300 ${
                selectedImage === img 
                ? "border-blue-600 scale-105 shadow-lg ring-2 ring-blue-100" 
                : "border-white shadow-sm hover:border-blue-200 opacity-70 hover:opacity-100"
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