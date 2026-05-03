"use client";
import React, { useState, useEffect } from 'react';

export default function WatchlistButton({ adId }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsSaved(saved.includes(adId));
  }, [adId]);

  const toggleSave = (e) => {
    e.preventDefault(); // যাতে লিঙ্কে ক্লিক না লেগে যায়
    const saved = JSON.parse(localStorage.getItem('watchlist') || '[]');
    let updated;

    if (saved.includes(adId)) {
      updated = saved.filter(id => id !== adId);
    } else {
      updated = [...saved, adId];
    }

    localStorage.setItem('watchlist', JSON.stringify(updated));
    setIsSaved(!isSaved);
    
    // হেডার কাউন্ট আপডেট করার জন্য ইভেন্ট পাঠানো
    window.dispatchEvent(new Event('watchlistUpdated'));
  };

  return (
    <button 
      onClick={toggleSave}
      className={`p-2 rounded-full shadow-md transition-all ${isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
      title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      <span className="text-lg">{isSaved ? '❤️' : '🤍'}</span>
    </button>
  );
}