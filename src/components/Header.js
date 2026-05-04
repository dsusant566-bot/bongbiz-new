"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Header() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const categories = [
    { name: "All", link: "/" },
    { name: "Resale", link: "/resale" },
    { name: "Property", link: "/property" },
    { name: "Wholesale", link: "/wholesale" },
    { name: "Services", link: "/services" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="bg-[#4B0082] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img src="/logo.png" alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
            <span className="text-xl font-bold hidden sm:block uppercase">BONGO<span className="text-purple-300">BIZ</span></span>
          </Link>

          <div className="flex-grow max-w-md relative">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full py-2 px-5 rounded-full bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:bg-white focus:text-black transition-all placeholder:text-purple-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* ওয়াচলিস্ট বাটন - এটি যোগ করা হলো */}
            <Link href="/watchlist" className="hidden md:flex items-center gap-1 hover:text-purple-300 transition text-sm font-medium">
              <span>❤️</span>
              <span className="text-xs">Watchlist</span>
            </Link>

            {status === "authenticated" ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-[10px] font-black uppercase">
                  MY ADS 🛠️
                </Link>
                <div className="flex items-center gap-2 border-l border-white/20 pl-2">
                  <img src={session.user?.image || "https://via.placeholder.com/100"} className="w-8 h-8 rounded-full border-2 border-purple-300" alt="user" />
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="text-[10px] font-black text-purple-200 hover:text-white uppercase">
                    LOGOUT
                  </button>
                </div>
              </div>
            ) : (
              <button 
  onClick={() => signIn('google', { callbackUrl: 'https://bongobiz.com' })} 
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
            <Link key={cat.name} href={cat.link} className="text-[11px] font-black text-gray-500 hover:text-[#7B00FF] uppercase tracking-widest transition-all">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}