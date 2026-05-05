"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  
  const loginWithGoogle = () => {
    // লগইন হওয়ার পর সরাসরি অ্যাডমিন পেজে পাঠিয়ে দেবে
    signIn('google', { callbackUrl: '/admin' }); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 text-center">
        
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-800 uppercase italic">
            Login <span className="text-blue-600">BongoBiz</span>
          </h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-2 rounded-full"></div>
        </div>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
          Administrative Portal Access
        </p>

        <button 
          onClick={loginWithGoogle} 
          className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-5 rounded-2xl font-black text-[11px] uppercase hover:bg-slate-50 transition-all shadow-sm group"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 group-hover:scale-110 transition-transform" alt="G" />
          Continue with Google
        </button>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}