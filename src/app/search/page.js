"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";
import Link from "next/link"; // এই লাইনটি আপনার মিসিং ছিল

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .or(`title.ilike.%${query}%,category.ilike.%${query}%,sub_category.ilike.%${query}%,item_type.ilike.%${query}%,location.ilike.%${query}%,district.ilike.%${query}%,state.ilike.%${query}%`)
        .eq("is_deleted", false);

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error("Search Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-black uppercase italic mb-6">
          Showing results for: <span className="text-[#7B00FF]">"{query}"</span>
        </h1>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-[#7B00FF] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-gray-400 uppercase text-xs tracking-widest text-[10px]">Searching BongoBiz...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-tighter">No listings found matching "{query}"</p>
            {/* এখন এই বাটনটি কাজ করবে কারণ Link ইমপোর্ট করা হয়েছে */}
            <Link href="/" className="mt-6 inline-block bg-[#7B00FF] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase shadow-lg hover:bg-black transition-all">
              Try Another Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-[10px]">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}