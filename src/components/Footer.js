import Link from 'next/link';

export default function Footer() {
  return (
    /* হেডারের গাঢ় পার্পল কালার [#4B0082] এখানে ব্যবহার করা হয়েছে */
    <footer className="bg-[#4B0082] text-white pt-20 pb-8 font-sans border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* লোগো ও ট্যাগলাইন - pt-12 যোগ করে ওপর থেকে নামিয়ে দেওয়া হয়েছে */}
        <div className="mb-12 pt-4">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
            BONGO<span className="text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.3)]">BIZ</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-purple-200 mt-4 opacity-90">
            West Bengal's Premiere Classified Hub
          </p>
        </div>

        {/* সব লিঙ্ক আগের মতোই রাখা হয়েছে */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-x-12 mb-12 px-4">
          <Link href="/about" className="text-[11px] font-black uppercase tracking-[0.25em] text-white hover:text-yellow-400 transition-all whitespace-nowrap">
            About Us
          </Link>
          <Link href="/contact" className="text-[11px] font-black uppercase tracking-[0.25em] text-white hover:text-yellow-400 transition-all whitespace-nowrap">
            Contact
          </Link>
          <Link href="/safety-tips" className="text-[11px] font-black uppercase tracking-[0.25em] text-white hover:text-yellow-400 transition-all whitespace-nowrap">
            Safety Tips
          </Link>
          <Link href="/privacy" className="text-[11px] font-black uppercase tracking-[0.25em] text-white hover:text-yellow-400 transition-all whitespace-nowrap">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[11px] font-black uppercase tracking-[0.25em] text-white hover:text-yellow-400 transition-all whitespace-nowrap">
            Terms & Conditions
          </Link>
        </div>

        {/* বিভাজক লাইন */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10"></div>

        {/* ডিসক্লেমার */}
        <div className="max-w-5xl mx-auto mb-12">
          <p className="text-[10px] md:text-[11px] text-purple-100 font-bold uppercase tracking-[0.2em] leading-relaxed px-6">
            <span className="text-yellow-400 font-black">Disclaimer:</span> BONGO<span className="italic">BIZ</span> IS A NEUTRAL ADVERTISING PLATFORM. WE ARE <span className="text-white underline decoration-yellow-400 underline-offset-8 font-black">NOT RESPONSIBLE</span> FOR ANY FRAUD, FINANCIAL LOSS, OR USER BEHAVIOR. USE AT YOUR OWN RISK.
          </p>
        </div>

        {/* কপিরাইট ও আপনার নাম */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-purple-300/60 pt-8 border-t border-white/5">
          <p>© 2026 BONGOBIZ. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10 mt-4 md:mt-0">
            <span className="text-white">DEVELOPED BY SUSANTA</span>
            <span className="text-yellow-400/50">TRUSTED BY THOUSANDS</span>
          </div>
        </div>

      </div>
    </footer>
  );
}