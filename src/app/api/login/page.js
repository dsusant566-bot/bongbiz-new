"use client";
import { signIn } from "next-auth/react"; // নেক্সট-অথ ব্যবহার করুন

export default function LoginPage() {
  
  const loginWithGoogle = () => {
    // এটি সরাসরি নেক্সট-অথ দিয়ে লগইন করাবে
    signIn('google', { callbackUrl: '/admin' }); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-xl border">
        <h2 className="text-3xl font-black text-center uppercase italic mb-10">
          Login <span className="text-blue-600">BongoBiz</span>
        </h2>

        <button 
          onClick={loginWithGoogle} 
          className="w-full flex items-center justify-center gap-3 bg-white border-2 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-50 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="G" />
          Continue with Google
        </button>
        
        <p className="text-center text-[9px] font-bold text-slate-400 mt-6 uppercase tracking-widest">
          Admin Access Only for Authorized Personnel
        </p>
      </div>
    </div>
  );
}