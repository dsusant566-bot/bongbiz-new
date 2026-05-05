"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";

// ক্যাটাগরি ও সাব-ক্যাটাগরির ডেটা
const categoryData = {
  Resale: {
    subs: ["Mobile", "Electronics", "Vehicles", "Home Appliances", "Furniture"],
    types: { "Mobile": ["Smart Phone", "Feature Phone", "Tablet"] }
  },
  Property: {
    subs: ["For Sale: Houses & Apartments", "For Rent: Houses & Apartments", "Lands & Plots"],
    types: {}
  },
  Wholesale: {
    subs: ["Clothing", "Electronics", "Groceries"],
    types: {}
  },
  Services: {
    subs: ["Tutors", "Electronics Repair", "Drivers"],
    types: {}
  }
};

export default function AdminControlPage() {
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '', price: '', description: '', category: '',
    sub_category: '', item_type: '', district: '',
    state: '', location: '', contact_number: ''
  });

  const [availableSubs, setAvailableSubs] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    fetchAllAds();
  }, []);

  useEffect(() => {
    if (editForm.category && categoryData[editForm.category]) {
      setAvailableSubs(categoryData[editForm.category].subs);
      if (!editingAd || editingAd.category !== editForm.category) {
          setEditForm(prev => ({...prev, sub_category: '', item_type: ''}));
      }
    } else {
      setAvailableSubs([]);
    }
  }, [editForm.category]);

  useEffect(() => {
    if (editForm.category && editForm.sub_category && categoryData[editForm.category]?.types[editForm.sub_category]) {
      setAvailableTypes(categoryData[editForm.category].types[editForm.sub_category]);
      if (!editingAd || editingAd.sub_category !== editForm.sub_category) {
        setEditForm(prev => ({...prev, item_type: ''}));
      }
    } else {
      setAvailableTypes([]);
    }
  }, [editForm.sub_category, editForm.category]);

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

  const toggleStatus = async (id, field, currentValue) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ [field]: !currentValue })
        .eq('id', id);
      if (!error) fetchAllAds();
    } catch (err) {
      alert("সমস্যা হয়েছে: " + err.message);
    }
  };

  const softDeleteAd = async (id, title) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${title}" অ্যাডটি ডিলিট করতে চান?`)) {
      try {
        const { error } = await supabase
          .from('listings')
          .update({ is_deleted: true }) 
          .eq('id', id);
        if (!error) {
            alert("সফলভাবে ডিলিট হয়েছে।");
            fetchAllAds();
        }
      } catch (err) {
        alert("ভুল হয়েছে: " + err.message);
      }
    }
  };

  const startEdit = (ad) => {
    setEditingAd(ad);
    setEditForm({
      title: ad.title || '', price: ad.price || '', description: ad.description || '',
      category: ad.category || '', sub_category: ad.sub_category || '',
      item_type: ad.item_type || '', district: ad.district || '',
      state: ad.state || '', location: ad.location || '', contact_number: ad.contact_number || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('listings')
        .update({ ...editForm })
        .eq('id', editingAd.id);

      if (error) throw error;
      alert("সফলভাবে আপডেট করা হয়েছে!");
      setEditingAd(null);
      fetchAllAds();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 transition-all";
  const labelStyle = "text-[11px] font-bold uppercase text-slate-500 ml-1 mb-1 block";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 pb-6 border-b border-slate-100 flex justify-between items-center">
            <h1 className="text-3xl font-black uppercase italic text-slate-800">Admin <span className="text-blue-600">Control</span></h1>
            <span className="text-[10px] font-black uppercase bg-white border px-4 py-2 rounded-full text-slate-400 tracking-widest">Dev Mode</span>
        </header>

        {loading ? (
          <div className="text-center py-20 font-bold text-blue-500 uppercase tracking-widest text-xs animate-pulse">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allAds.map((ad) => (
              <div key={ad.id} className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-5 w-full">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden relative">
                    <img src={ad.image_url_1 || "https://via.placeholder.com/100"} className="w-full h-full object-cover" alt="" />
                    {ad.is_featured && <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-[9px] font-black px-2 rounded-full">⭐</div>}
                  </div>
                  <div>
                    <h3 className="font-black text-base uppercase italic">{ad.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{ad.category} &gt; {ad.sub_category}</p>
                    <p className="text-lg text-blue-600 font-black mt-1">₹{ad.price}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
                  <button onClick={() => toggleStatus(ad.id, 'is_featured', ad.is_featured)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border ${ad.is_featured ? 'bg-yellow-400 border-yellow-500' : 'bg-white text-slate-400'}`}>Featured</button>
                  <button onClick={() => toggleStatus(ad.id, 'is_sold', ad.is_sold)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border ${ad.is_sold ? 'bg-red-600 text-white' : 'bg-white text-slate-400'}`}>Sold</button>
                  <button onClick={() => startEdit(ad)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-md">Edit</button>
                  <button onClick={() => softDeleteAd(ad.id, ad.title)} className="bg-red-50 text-red-500 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border border-red-100">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Edit Modal (GPS ছাড়া) --- */}
      {editingAd && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-4xl w-full shadow-2xl my-10 relative">
            <header className="mb-8 border-b pb-6 border-slate-100">
                <h2 className="text-3xl font-black italic uppercase text-slate-950">Edit <span className="text-blue-600">Details</span></h2>
            </header>
            
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <label className={labelStyle}>Category</label>
                <select value={editForm.category} className={inputStyle} onChange={(e) => setEditForm({...editForm, category: e.target.value})}>
                  {Object.keys(categoryData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Sub-Category</label>
                <select value={editForm.sub_category} className={inputStyle} onChange={(e) => setEditForm({...editForm, sub_category: e.target.value})}>
                  {availableSubs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Item Type</label>
                <select value={editForm.item_type} className={inputStyle} onChange={(e) => setEditForm({...editForm, item_type: e.target.value})}>
                  <option value="">N/A</option>
                  {availableTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className={labelStyle}>Ad Title</label>
                <input type="text" value={editForm.title} className={inputStyle} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Price (₹)</label>
                <input type="number" value={editForm.price} className={inputStyle} onChange={(e) => setEditForm({...editForm, price: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Location</label>
                <input type="text" value={editForm.location} className={inputStyle} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>District</label>
                <input type="text" value={editForm.district} className={inputStyle} onChange={(e) => setEditForm({...editForm, district: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>State</label>
                <input type="text" value={editForm.state} className={inputStyle} onChange={(e) => setEditForm({...editForm, state: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Contact Number</label>
                <input type="text" value={editForm.contact_number} className={inputStyle} onChange={(e) => setEditForm({...editForm, contact_number: e.target.value})} />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className={labelStyle}>Description</label>
                <textarea rows="4" value={editForm.description} className={inputStyle} onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea>
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex gap-4 pt-6 border-t border-slate-100">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs">Save Changes</button>
                <button type="button" onClick={() => setEditingAd(null)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-xs">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}