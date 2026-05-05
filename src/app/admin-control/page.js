"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";

export default function AdminControlPage() {
  // সিকিউরিটি (useSession, status, useRouter) পুরোপুরি সরিয়ে দেওয়া হয়েছে
  
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '', price: '', description: '', category: '',
    sub_category: '', item_type: '', district: '',
    state: '', location: '', contact_number: ''
  });

  // পেজ লোড হলেই সরাসরি ডেটা নিয়ে আসবে, কোনো চেক করবে না
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

  const toggleStatus = async (id, field, currentValue) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ [field]: !currentValue })
        .eq('id', id);

      if (error) throw error;
      setAllAds(allAds.map(ad => ad.id === id ? { ...ad, [field]: !currentValue } : ad));
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8 border-l-8 border-[#ff6600] pl-4">
          Admin <span className="text-[#ff6600]">Direct Control</span>
        </h1>

        {loading ? (
          <div className="text-center py-20 font-bold text-blue-500 uppercase tracking-widest text-xs">Loading Listings...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allAds.map((ad) => (
              <div key={ad.id} className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-100">
                <div className="flex items-center gap-5 w-full">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img src={ad.image_url_1 || "https://via.placeholder.com/100"} className={`w-full h-full object-cover ${ad.is_sold ? 'grayscale opacity-50' : ''}`} alt="" />
                    {ad.is_featured && <div className="absolute top-1 left-1 bg-yellow-400 text-[8px] font-black px-1 rounded">⭐</div>}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase italic">{ad.title}</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">₹{ad.price}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  <button onClick={() => toggleStatus(ad.id, 'is_featured', ad.is_featured)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${ad.is_featured ? 'bg-yellow-400 border-yellow-500' : 'bg-white'}`}>
                    {ad.is_featured ? "⭐ Featured" : "Make Featured"}
                  </button>
                  <button onClick={() => toggleStatus(ad.id, 'is_sold', ad.is_sold)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${ad.is_sold ? 'bg-red-600 text-white' : 'bg-white'}`}>
                    {ad.is_sold ? "🚫 Sold" : "Mark Sold"}
                  </button>
                  <button onClick={() => startEdit(ad)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase">Edit</button>
                  <button onClick={() => softDeleteAd(ad.id, ad.title)} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal (আগের মতোই আছে) */}
      {editingAd && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl my-8">
            <h2 className="text-2xl font-black italic uppercase mb-6 text-slate-900">Edit Details</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={editForm.title} className="w-full bg-slate-50 rounded-2xl px-5 py-3 text-sm" placeholder="Title" onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
              <input type="number" value={editForm.price} className="w-full bg-slate-50 rounded-2xl px-5 py-3 text-sm" placeholder="Price" onChange={(e) => setEditForm({...editForm, price: e.target.value})} />
              <textarea rows="3" value={editForm.description} className="md:col-span-2 w-full bg-slate-50 rounded-2xl px-5 py-3 text-sm" placeholder="Description" onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea>
              <button type="submit" className="bg-[#ff6600] text-white py-4 rounded-2xl font-black uppercase text-[10px]">Save</button>
              <button type="button" onClick={() => setEditingAd(null)} className="bg-slate-100 py-4 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}