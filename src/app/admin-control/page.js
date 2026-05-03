"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";

export default function AdminControlPage() {
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    sub_category: '',
    item_type: '', 
    district: '',
    state: '',
    location: '',
    contact_number: ''
  });

  useEffect(() => {
    fetchAllAds();
  }, []);

  const fetchAllAds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_deleted', false) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllAds(data);
    } catch (err) {
      console.error("Error fetching ads:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- নতুন ফাংশন: Featured বা Sold স্ট্যাটাস টগল করার জন্য ---
  const toggleStatus = async (id, field, currentValue) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ [field]: !currentValue })
        .eq('id', id);

      if (error) throw error;
      
      // লোকাল স্টেট আপডেট করা যাতে পেজ রিফ্রেশ ছাড়াই বাটন কালার চেঞ্জ হয়
      setAllAds(allAds.map(ad => ad.id === id ? { ...ad, [field]: !currentValue } : ad));
    } catch (err) {
      alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে: " + err.message);
    }
  };

  const softDeleteAd = async (id, title) => {
    const confirmDelete = confirm(`আপনি কি নিশ্চিত যে "${title}" অ্যাডটি ডিলিট করতে চান?`);
    if (confirmDelete) {
      try {
        const { error } = await supabase
          .from('listings')
          .update({ is_deleted: true }) 
          .eq('id', id);

        if (error) throw error;
        alert("সফলভাবে ডিলিট হয়েছে।");
        fetchAllAds();
      } catch (err) {
        alert("ভুল হয়েছে: " + err.message);
      }
    }
  };

  const startEdit = (ad) => {
    setEditingAd(ad);
    setEditForm({
      title: ad.title || '',
      price: ad.price || '',
      description: ad.description || '',
      category: ad.category || '',
      sub_category: ad.sub_category || '',
      item_type: ad.item_type || '', 
      district: ad.district || '',
      state: ad.state || '',
      location: ad.location || '',
      contact_number: ad.contact_number || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('listings')
        .update({ 
          title: editForm.title, 
          price: editForm.price, 
          description: editForm.description,
          category: editForm.category,
          sub_category: editForm.sub_category,
          item_type: editForm.item_type,
          district: editForm.district,
          state: editForm.state,
          location: editForm.location,
          contact_number: editForm.contact_number
        })
        .eq('id', editingAd.id);

      if (error) {
        alert("আপডেট করতে সমস্যা হয়েছে: " + error.message);
        return;
      }
      
      alert("সফলভাবে আপডেট করা হয়েছে!");
      setEditingAd(null);
      fetchAllAds();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8 border-l-8 border-[#ff6600] pl-4">
          Admin <span className="text-[#ff6600]">Super Control</span>
        </h1>

        {loading ? (
          <div className="text-center py-20 font-bold text-blue-500 animate-pulse uppercase tracking-widest text-xs">Loading Listings...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allAds.map((ad) => (
              <div key={ad.id} className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-5 w-full">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img src={ad.image_url_1 || "https://via.placeholder.com/100"} className={`w-full h-full object-cover ${ad.is_sold ? 'grayscale opacity-50' : ''}`} alt="" />
                    {ad.is_featured && <div className="absolute top-1 left-1 bg-yellow-400 text-[8px] font-black px-1 rounded">⭐</div>}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase italic text-slate-800">{ad.title}</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                      {ad.category} &gt; {ad.sub_category} {ad.item_type && `(${ad.item_type})`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-[#00a2ed] font-black">₹{ad.price}</p>
                        {ad.is_sold && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Sold</span>}
                    </div>
                  </div>
                </div>

                {/* কন্ট্রোল বাটন সেকশন */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  {/* Featured Toggle */}
                  <button 
                    onClick={() => toggleStatus(ad.id, 'is_featured', ad.is_featured)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${ad.is_featured ? 'bg-yellow-400 border-yellow-500 text-black shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:bg-yellow-50'}`}
                  >
                    {ad.is_featured ? "⭐ Featured" : "Make Featured"}
                  </button>

                  {/* Sold Toggle */}
                  <button 
                    onClick={() => toggleStatus(ad.id, 'is_sold', ad.is_sold)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${ad.is_sold ? 'bg-red-600 border-red-700 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:bg-red-50'}`}
                  >
                    {ad.is_sold ? "🚫 Sold Out" : "Mark as Sold"}
                  </button>

                  {/* Edit & Delete */}
                  <button onClick={() => startEdit(ad)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-blue-600 transition-all shadow-sm">Edit</button>
                  <button onClick={() => softDeleteAd(ad.id, ad.title)} className="bg-red-50 text-red-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- এডিট মোডাল (আগের মতোই আছে) --- */}
      {editingAd && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl my-8">
            <h2 className="text-2xl font-black text-slate-900 italic uppercase mb-6">Edit <span className="text-[#ff6600]">Details</span></h2>
            
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Product / Ad Title</label>
                <input type="text" value={editForm.title} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Category</label>
                <input type="text" value={editForm.category} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, category: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Sub Category</label>
                <input type="text" value={editForm.sub_category} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, sub_category: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Item Type</label>
                <input type="text" value={editForm.item_type} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, item_type: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Price (₹)</label>
                <input type="number" value={editForm.price} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, price: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Contact Number</label>
                <input type="text" value={editForm.contact_number} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, contact_number: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">District</label>
                <input type="text" value={editForm.district} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, district: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">State</label>
                <input type="text" value={editForm.state} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, state: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Location / Area</label>
                <input type="text" value={editForm.location} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Description</label>
                <textarea rows="3" value={editForm.description} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600]" onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea>
              </div>
              <div className="md:col-span-2 flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-[#ff6600] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">Save Changes</button>
                <button type="button" onClick={() => setEditingAd(null)} className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}