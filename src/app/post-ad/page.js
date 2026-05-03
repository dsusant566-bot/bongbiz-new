"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PostAd() {
  const [loading, setLoading] = useState(false);
  const [img1Name, setImg1Name] = useState("");
  const [img2Name, setImg2Name] = useState("");
  
  const [formData, setFormData] = useState({
    category: "Resale",
    sub_category: "Electronics",
    item_type: "", 
    other_item_type: "", 
    title: "",
    price: "",
    description: "", 
    location: "", 
    district: "", 
    contact_number: "", 
    state: "",
    image_url_1: "", 
    image_url_2: ""
  });

  const categoryStructure = {
    "Resale": { 
      "Vehicles": ["Car", "Bike", "Scooty", "Bicycle", "E-Rickshaw", "Truck", "Tractor", "Spare Parts", "Others"], 
      "Electronics": ["Mobile", "Laptop", "Desktop PC", "Tablet", "Camera", "Others"],
      "Home Appliances": ["TV", "Fridge", "Washing Machine", "AC", "Cooler", "Geyser", "Microwave", "Kitchen Appliances", "Others"],
      "Furniture": ["Bed", "Sofa", "Almirah", "Dining Table", "Chair/Table", "Office Furniture", "Others"],
      "Hobbies & Fashion": ["Books", "Musical Instruments", "Sports Equipment", "Men Fashion", "Women Fashion", "Kids Fashion", "Others"],
      "Others": ["Specify"]
    },
    "Wholesale": { 
      "Construction & Industrial": ["Cement", "Steel/Rod", "Bricks/Sand", "Pipes", "Machinery Tool", "Industrial Chemical", "Others"], 
      "Garments & Textile": ["T-Shirts", "Sarees", "Jeans", "Fabric", "Kids Wear", "Undergarments", "Others"],
      "FMCG & Grocery": ["Rice/Pulse", "Spices", "Oil", "Packaged Food", "Cosmetics", "Detergent", "Others"],
      "Electronics & Gadgets": ["Mobile Accessories", "Computer Parts", "Cables", "Smart Gadgets", "Lighting/LED", "Others"],
      "Agriculture": ["Seeds", "Fertilizer", "Pesticide", "Farming Tool", "Agri Produce", "Others"],
      "Others": ["Specify"]
    },
    "Property": { 
      "For Sale": ["Flat/Apartment", "House/Villa", "Shop", "Land", "Office Space", "Others"], 
      "For Rent": ["Flat/Apartment", "House/Villa", "Shop", "Office Space", "Godown/Warehouse", "Paying Guest (PG)", "Others"],
      "Buy/Find": ["Residential Flat", "House", "Land/Plot", "Shop/Office", "Others"]
    },
    "Services": { 
      "Jobs": ["Data Entry/Back Office", "Sales & Marketing", "Driver", "Delivery Boy", "Teacher/Tutor", "BPO/Customer Service", "Office Staff", "Receptionist", "Others"],
      "Business & Financial": ["Loan Services", "Insurance", "Accounting/GST", "Licensing/Registration", "Legal Consultant", "Digital Marketing", "IT Support", "Others"],
      "Home & Personal": ["Plumber", "Electrician", "Carpenter", "AC Repair", "Cleaning Service", "Pest Control", "Painter", "Beauty/Makeup", "Others"], 
      "Education & Training": ["School Tuitions", "Competitive Exams", "Computer Course", "Language Class", "Dance/Music", "Others"],
      "Event & Decor": ["Wedding Planner", "Catering Service", "Photography", "Decoration", "Event Venue", "Others"],
      "Tours & Travels": ["Car Rental", "Tour Package", "Ticket Booking", "Hotel Booking", "Others"]
    }
  };

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddet3sfmx/image/upload";
  const UPLOAD_PRESET = "bongobiz_preset";

  // useEffect: লগইন করে ফিরে আসার পর যদি localStorage-এ কোনো ডেটা থাকে, তবে সেটি অটো পাবলিশ হবে
  useEffect(() => {
    const autoPublish = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const savedAd = localStorage.getItem("pending_ad");

      if (session && savedAd) {
        setLoading(true);
        try {
          const adData = JSON.parse(savedAd);
          const { error } = await supabase.from("listings").insert([{
            ...adData,
            user_email: session.user.email
          }]);
          if (error) throw error;
          alert("Ad Published Successfully! 🚀");
          localStorage.removeItem("pending_ad"); // পাবলিশ হয়ে গেলে ডেটা মুছে ফেলো
        } catch (err) {
          console.error("Auto-publish error:", err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    autoPublish();
  }, []);

  const compressImage = async (file) => {
    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1024, useWebWorker: true };
    return await imageCompression(file, options);
  };

  const uploadToCloudinary = async (file) => {
    const compressedFile = await compressImage(file);
    const data = new FormData();
    data.append("file", compressedFile);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
    const fileData = await res.json();
    return fileData.secure_url;
  };

  const getMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData({ ...formData, location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}` });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.item_type) return alert("Please select an Item Type!");
    setLoading(true);

    try {
      // ১. ছবি আপলোড (আগে ছবি সেভ হবে যাতে পেজ রিলোড হলেও লিঙ্ক থাকে)
      let img1 = "", img2 = "";
      const f1 = document.getElementById("img1").files[0];
      const f2 = document.getElementById("img2").files[0];
      if (f1) img1 = await uploadToCloudinary(f1);
      if (f2) img2 = await uploadToCloudinary(f2);

      const finalItem = formData.item_type === "Others" || formData.item_type === "Specify" ? formData.other_item_type : formData.item_type;

      const adData = {
        title: formData.title,
        price: formData.price,
        description: formData.description,
        category: formData.category,
        sub_category: formData.sub_category,
        item_type: finalItem,
        location: formData.location,
        district: formData.district,
        state: formData.state, 
        contact_number: formData.contact_number,
        image_url_1: img1, 
        image_url_2: img2,
        is_deleted: false
      };

      // ২. সেশন চেক করা
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // লগইন না থাকলে ডেটা localStorage-এ রাখো এবং গুগল পপ-আপ দেখাও
        localStorage.setItem("pending_ad", JSON.stringify(adData));
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.href, // লগইন শেষে এই পেজেই ফিরবে
          }
        });
        if (error) throw error;
        return; 
      }

      // ৩. লগইন থাকলে সরাসরি পাবলিশ
      const { error } = await supabase.from("listings").insert([{
        ...adData,
        user_email: session.user.email
      }]);

      if (error) throw error;
      alert("Ad Published Successfully! 🚀");
      localStorage.removeItem("pending_ad");

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-3 bg-gray-100 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 text-slate-800 placeholder-gray-400 transition-all shadow-inner";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl w-full max-w-2xl border border-gray-100">
        
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black uppercase italic text-slate-800 tracking-tighter leading-none">
            POST NEW <span className="text-blue-600">AD</span>
          </h1>
          <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1 italic">India's Most Trusted Marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Category</label>
              <select className={inputStyle} value={formData.category} 
                onChange={(e) => { 
                  const sub = Object.keys(categoryStructure[e.target.value])[0];
                  setFormData({...formData, category: e.target.value, sub_category: sub, item_type: ""});
                }}>
                {Object.keys(categoryStructure).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Sub-Category</label>
              <select className={inputStyle} value={formData.sub_category} 
                onChange={(e) => setFormData({...formData, sub_category: e.target.value, item_type: ""})}>
                {Object.keys(categoryStructure[formData.category]).map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Item Type</label>
              <select className={inputStyle} value={formData.item_type} onChange={(e) => setFormData({...formData, item_type: e.target.value})} required>
                <option value="">Select Item</option>
                {categoryStructure[formData.category][formData.sub_category].map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Ad Title</label>
              <input className={inputStyle} placeholder="Product Name" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Price (₹)</label>
              <input type="number" className={inputStyle} placeholder="Enter Price" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 relative">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Location</label>
              <input className={inputStyle} value={formData.location} placeholder="Area / Village / City" onChange={(e) => setFormData({...formData, location: e.target.value})} required />
              <button type="button" onClick={getMyLocation} className="absolute right-2 bottom-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase shadow-md">GPS</button>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-blue-600">District</label>
              <input className={inputStyle} placeholder="Enter Your District" onChange={(e) => setFormData({...formData, district: e.target.value})} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[9px] font-black uppercase ml-3 text-blue-600">State</label>
                <input className={inputStyle} placeholder="Enter Your State" onChange={(e) => setFormData({...formData, state: e.target.value})} required />
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Contact Number</label>
                <input className="w-full p-3 bg-white rounded-xl outline-none font-bold text-sm border-2 border-blue-400 text-slate-800 shadow-sm"
                placeholder="Phone Number" onChange={(e) => setFormData({...formData, contact_number: e.target.value})} required />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-gray-400">Image 1</label>
              <input type="file" id="img1" accept="image/*" onChange={(e) => setImg1Name(e.target.files[0]?.name || "")} className="text-[9px] w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase ml-3 text-gray-400">Image 2</label>
              <input type="file" id="img2" accept="image/*" onChange={(e) => setImg2Name(e.target.files[0]?.name || "")} className="text-[9px] w-full" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase ml-3 text-blue-600">Description</label>
            <textarea className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-blue-500 h-20 resize-none text-slate-800 shadow-inner"
              placeholder="Provide key details about your ad..." onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black bg-blue-600 text-white hover:bg-black transition-all shadow-lg uppercase text-[11px] tracking-widest mt-2">
             {loading ? "PREPARING AD..." : "PUBLISH AD NOW 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}