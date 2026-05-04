"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Header() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const categories = [
    { name: "All", link: "/" },
    { name: "Resale", link: "/resale" },
    { name: "Property", link: "/property" },
    { name: "Wholesale", link: "/wholesale" },
    { name: "Services", link: "/services" },
  ];

  // সার্চ হ্যান্ডলার - যা আপনার সার্চ পেজকে সঠিক তথ্য পাঠাবে
  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="bg-[#4B0082] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src="/logo.png" 
              alt="BongoBiz Logo" 
              className="h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
            <span className="text-xl font-bold tracking-tighter hidden sm:block uppercase">
              BONGO<span className="text-purple-300">BIZ</span>
            </span>
          </Link>

          {/* সার্চ বার */}
          <div className="flex-grow max-w-md relative">
            <input
              type="text"
              placeholder="Search items, areas, or services..."
              className="w-full py-2 px-5 rounded-full bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:bg-white focus:text-black transition-all placeholder:text-purple-200 focus:placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button 
              onClick={() => search.trim() && router.push(`/search?q=${encodeURIComponent(search.trim())}`)}
              className="absolute right-4 top-2 text-purple-200"
            >
              🔍
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/watchlist" className="hidden md:flex items-center gap-1 hover:text-purple-300 transition text-sm font-medium">
              <span>❤️</span>
              <span className="text-xs">Watchlist</span>
            </Link>

            {session ? (
              <div className="flex items-center gap-2">
                <Link 
                  href="/dashboard" 
                  className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-[10px] font-black hover:bg-white transition shadow-md"
                >
                  MY ADS 🛠️
                </Link>
                <div className="flex items-center gap-2 border-l border-white/20 pl-2">
                  <img 
                    src={session.user?.image || "https://via.placeholder.com/100"} 
                    className="w-8 h-8 rounded-full border-2 border-purple-300" 
                    alt="user" 
                  />
                  <button 
                    {/* লগআউট করলে হোমপেজে পাঠিয়ে দেবে */}
                    onClick={() => signOut({ callbackUrl: '/' })} 
                    className="hidden sm:block text-[9px] font-black text-purple-200 hover:text-white uppercase tracking-tighter"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            ) : (
              <button 
                {/* লগইন করলে যে পেজে আছেন সেখানেই ফেরত আনবে */}
                onClick={() => signIn('google', { callbackUrl: window.location.href })} 
                className="bg-[#7B00FF] hover:bg-white hover:text-[#7B00FF] text-white px-5 py-1.5 rounded-full font-black text-xs shadow-md transition-all border border-white/20 uppercase"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-start md:justify-center gap-8 whitespace-nowrap">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.link}
              className="text-[11px] font-black text-gray-500 hover:text-[#7B00FF] uppercase tracking-widest transition-all relative group"
            >
              {cat.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7B00FF] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}