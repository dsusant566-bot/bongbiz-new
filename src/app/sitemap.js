// app/sitemap.js
import { supabase } from "@/lib/supabaseClient";

export default async function sitemap() {
  const baseUrl = "https://bongobiz.com"; // আপনার আসল ডোমেইন এখানে সেট করা হলো

  // ১. অ্যাডগুলো ফেচ করুন
  const { data: ads } = await supabase
    .from("listings")
    .select("id, title, item_type, location, district, state, created_at");
    // .eq("is_deleted", false); // আপনার টেবিলে এই কলাম থাকলে রাখুন, না থাকলে ডিলিট করুন

  // ২. ডাইনামিক ইউআরএল তৈরি
  const adUrls = ads?.map((item) => {
    const clean = (text) => (text || "").toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const slug = `${clean(item.title)}-${clean(item.item_type)}-${clean(item.location)}-${clean(item.district)}-${clean(item.state || "west-bengal")}-india-${item.id}`;
    
    return {
      url: `${baseUrl}/item/${slug}`,
      lastModified: item.created_at ? new Date(item.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  }) || [];

  // ৩. স্ট্যাটিক পেজগুলো
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/resale`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/property`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/wholesale`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...adUrls,
  ];
}