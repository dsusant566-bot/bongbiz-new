"use client";
import React from 'react';
import Link from 'next/link';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto p-10 text-slate-800">
      <h1 className="text-4xl font-black uppercase italic border-l-8 border-blue-600 pl-4 mb-10 text-slate-900">
        Contact Support
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* বাম পাশ: অফিসিয়াল তথ্য */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-400 mb-2">Office Address</h3>
            <p className="font-bold text-xl leading-snug">
              Suronno Enterprise<br />
              Chakdaha, Nadia, West Bengal<br />
              India, PIN: 741222
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase text-slate-400 mb-2">Helpline Number</h3>
            <p className="font-black text-2xl text-slate-900">+91 7585999923</p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase text-slate-400 mb-2">Business Hours</h3>
            <p className="font-bold text-xl text-slate-600">Mon - Sat: 10:00 AM - 7:00 PM</p>
          </div>
        </div>

        {/* ডান পাশের নীল বক্স: ইনকোয়ারি ফর্ম লিঙ্ক */}
        <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-center">
          <h2 className="text-2xl font-black uppercase italic mb-4">Need Help?</h2>
          <p className="font-medium mb-8 opacity-90">
            If you have issues with an ad, reporting fraud, or any business inquiries, please use our official inquiry form.
          </p>
          <div className="space-y-4">
             {/* Internal Link to /enquiry page */}
             <Link 
               href="/enquiry" 
               className="block w-full py-4 bg-white text-blue-600 text-center font-black uppercase rounded-2xl shadow-lg hover:scale-105 transition-all"
             >
               Open Inquiry Form
             </Link>
             <p className="text-center text-[10px] font-black uppercase opacity-60 tracking-widest">
               Response Time: Within 24 Hours
             </p>
          </div>
        </div>
      </div>
      
      {/* ফুটারে ইমেল আইডিগুলো */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-10">
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Official Support</p>
           <p className="font-bold text-slate-700">info@bongobiz.com</p>
        </div>
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">General Inquiry</p>
           <p className="font-bold text-slate-700">bongobiz.official@gmail.com</p>
        </div>
      </div>
    </div>
  );
}