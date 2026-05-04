"use client";

import { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // গুগল লগইন ফাংশন - এখন ড্যাশবোর্ডে জোর করে পাঠাবে না
  async function loginWithGoogle() {
  setLoading(true);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { 
      // এটি এখন বুদ্ধিমানের মতো রিডাইরেক্ট করবে
      redirectTo: window.location.href 
    }
  });
  if (error) {
    alert("গুগল লগইনে সমস্যা: " + error.message);
    setLoading(false);
  }
}

  // ওটিপি পাঠানো
  async function sendOTP() {
    if (!email) return alert("ইমেল দিন");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { 
        emailRedirectTo: `${window.location.origin}` 
      }
    });
    setLoading(false);
    if (!error) {
      setStep(2);
      alert("ওটিপি পাঠানো হয়েছে।");
    } else {
      alert("সমস্যা: " + error.message);
    }
  }

  // ওটিপি ভেরিফাই
  async function verifyOTP() {
    if (!otp) return alert("ওটিপি দিন");
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email', 
    });

    if (!error) {
      // সফল হলে হোমপেজে বা আগের পেজে পাঠানো হচ্ছে
      window.location.href = '/';
    } else {
      alert("ভুল ওটিপি!");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 uppercase italic">
            Login <span className="text-blue-600">BongoBiz</span>
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-full"></div>
        </div>

        <button 
          onClick={loginWithGoogle} 
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-50 transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="G" />
          Continue with Google
        </button>

        <div className="relative my-10">
          <hr className="border-slate-100" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-slate-300 uppercase">Or OTP Login</span>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none font-bold text-xs uppercase"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendOTP} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-blue-600 transition-all">
              {loading ? "Sending..." : "Send Login Code"}
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <input 
              type="text" 
              placeholder="ENTER OTP" 
              className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none font-black text-center tracking-[10px] text-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOTP} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-black transition-all">
              Verify & Enter
            </button>
            <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 uppercase mt-4 hover:text-blue-600">Change Email</button>
          </div>
        )}
      </div>
    </div>
  );
}