"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";

export default function AdminControlPage() {
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '', price: '', description: '', category: '',
    sub_category: '', item_type: '', district: '',
    state: '', location: '', contact_number: ''
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllAds(data);
    } catch (err) {
      console.error("Error fetching ads:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, field, currentValue) => {
    try {
      const { error } = await supabase.from('listings').update({ [field]: !currentValue }).eq('id', id);
      if (error) throw error;
      fetchAllAds();
    } catch (err) {
      alert("সমস্যা হয়েছে!");
    }
  };

  const toggleDeleteAd = async (id, title, currentStatus) => {
    const action = currentStatus ? "Restore" : "Delete";
    if (confirm(`Are you sure you want to ${action} "${title}"?`)) {
      try {
        const { error } = await supabase.from('listings').update({ is_deleted: !currentStatus }).eq('id', id);
        if (error) throw error;
        fetchAllAds();
      } catch (err) {
        alert("ভুল হয়েছে!");
      }
    }
  };

  const startEdit = (ad) => {
    setEditingAd(ad);
    setEditForm({ ...ad });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('listings').update({ ...editForm }).eq('id', editingAd.id);
      if (error) throw error;
      alert("সফলভাবে আপডেট করা হয়েছে!");
      setEditingAd(null);
      fetchAllAds();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // অ্যাডগুলোকে দুই ভাগে ভাগ করা
  const liveAds = allAds.filter(ad => !ad.is_deleted);
  const deletedAds = allAds.filter(ad => ad.is_deleted);

  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#ff6600] outline-none";
  const labelStyle = "text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8 border-l-8 border-[#ff6600] pl-4">
          Admin <span className="text-[#ff6600]">Control</span>
        </h1>

        {loading ? (
          <div className="text-center py-20 font-black text-slate-300 animate-pulse">LOADING...</div>
        ) : (
          <div className="space-y-12">
            
            {/* --- LIVE ADS SECTION --- */}
            <section>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Listings ({liveAds.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {liveAds.map((ad) => (
                  <div key={ad.id} className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-100">
                    <div className="flex items-center gap-5 w-full">
                      <img src={ad.image_url_1 || "https://via.placeholder.com/100"} className="w-20 h-20 bg-slate-100 rounded-2xl object-cover" alt="" />
                      <div>
                        <h3 className="font-black text-sm uppercase italic">{ad.title}</h3>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">₹{ad.price} | {ad.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                      <button onClick={() => toggleStatus(ad.id, 'is_featured', ad.is_featured)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${ad.is_featured ? 'bg-yellow-400 border-yellow-500' : 'bg-white'}`}>Star</button>
                      <button onClick={() => toggleStatus(ad.id, 'is_sold', ad.is_sold)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${ad.is_sold ? 'bg-red-600 text-white' : 'bg-white'}`}>Sold</button>
                      <button onClick={() => startEdit(ad)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase">Edit</button>
                      <button onClick={() => toggleDeleteAd(ad.id, ad.title, ad.is_deleted)} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-red-100">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- DELETED ADS SECTION (আলাদা বটম সেকশন) --- */}
            {deletedAds.length > 0 && (
              <section className="pt-10 border-t-2 border-dashed border-slate-200">
                <h2 className="text-sm font-black uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span> Trash / Deleted ({deletedAds.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 opacity-70">
                  {deletedAds.map((ad) => (
                    <div key={ad.id} className="bg-slate-100/50 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 border border-dashed border-slate-200">
                      <div className="flex items-center gap-5 w-full grayscale">
                        <img src={ad.image_url_1 || "https://via.placeholder.com/100"} className="w-16 h-16 rounded-xl object-cover" alt="" />
                        <div>
                          <h3 className="font-black text-sm uppercase italic text-slate-400 line-through">{ad.title}</h3>
                          <p className="text-[9px] font-bold text-slate-300 uppercase">DELETED LISTING</p>
                        </div>
                      </div>
                      <button onClick={() => toggleDeleteAd(ad.id, ad.title, ad.is_deleted)} className="bg-green-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-green-200">
                        Restore (Live)
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* --- Edit Modal --- */}
      {editingAd && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-4xl w-full shadow-2xl my-8">
            <h2 className="text-2xl font-black italic uppercase mb-8 border-b pb-4">Edit Details</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div><label className={labelStyle}>Category</label><input type="text" value={editForm.category} className={inputStyle} onChange={(e) => setEditForm({...editForm, category: e.target.value})} /></div>
              <div><label className={labelStyle}>Sub Category</label><input type="text" value={editForm.sub_category} className={inputStyle} onChange={(e) => setEditForm({...editForm, sub_category: e.target.value})} /></div>
              <div><label className={labelStyle}>Type</label><input type="text" value={editForm.item_type} className={inputStyle} onChange={(e) => setEditForm({...editForm, item_type: e.target.value})} /></div>
              <div className="lg:col-span-2"><label className={labelStyle}>Title</label><input type="text" value={editForm.title} className={inputStyle} onChange={(e) => setEditForm({...editForm, title: e.target.value})} /></div>
              <div><label className={labelStyle}>Price</label><input type="number" value={editForm.price} className={inputStyle} onChange={(e) => setEditForm({...editForm, price: e.target.value})} /></div>
              <div><label className={labelStyle}>Location</label><input type="text" value={editForm.location} className={inputStyle} onChange={(e) => setEditForm({...editForm, location: e.target.value})} /></div>
              <div><label className={labelStyle}>District</label><input type="text" value={editForm.district} className={inputStyle} onChange={(e) => setEditForm({...editForm, district: e.target.value})} /></div>
              <div><label className={labelStyle}>State</label><input type="text" value={editForm.state} className={inputStyle} onChange={(e) => setEditForm({...editForm, state: e.target.value})} /></div>
              <div><label className={labelStyle}>Contact</label><input type="text" value={editForm.contact_number} className={inputStyle} onChange={(e) => setEditForm({...editForm, contact_number: e.target.value})} /></div>
              <div className="lg:col-span-3"><label className={labelStyle}>Description</label><textarea rows="3" value={editForm.description} className={inputStyle} onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea></div>
              <div className="lg:col-span-3 flex gap-4 mt-4"><button type="submit" className="flex-1 bg-[#ff6600] text-white py-4 rounded-2xl font-black uppercase text-xs">Save</button><button type="button" onClick={() => setEditingAd(null)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-xs">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}