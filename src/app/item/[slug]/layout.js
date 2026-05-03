import { supabase } from "@/lib/supabaseClient";
import { getIdFromSlug } from "@/lib/utils";

export async function generateMetadata({ params }) {
  // ১. প্যারামস রিজলভ করা (Next.js 15+ এর জন্য জরুরি)
  const resolvedParams = await params;
const rawSlug = resolvedParams.slug;
const idFromSlug = getIdFromSlug(rawSlug);

  // ৩. ডাটাবেস থেকে তথ্য আনা
  const { data: ad } = await supabase
    .from("listings")
    .select("title, description, image_url_1, price, location")
    .eq("id", idFromSlug)
    .single();

  if (!ad) return { title: "Ad Not Found | BongoBiz" };

  // ৪. ডাইনামিক এসইও রিটার্ন করা
  return {
    title: `${ad.title} at ₹${ad.price} in ${ad.location} | BongoBiz`,
    description: ad.description?.substring(0, 160) || "Find the best deals on BongoBiz Marketplace.",
    openGraph: {
      title: `${ad.title} - BongoBiz`,
      description: ad.description?.substring(0, 100),
      url: `https://bongobiz.com/item/${rawSlug}`,
      siteName: 'BongoBiz Marketplace',
      images: [
        {
          url: ad.image_url_1 && ad.image_url_1 !== "EMPTY" ? ad.image_url_1 : "https://bongobiz.com/default-share-image.jpg",
          width: 1200,
          height: 630,
          alt: ad.title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ad.title,
      description: ad.description?.substring(0, 100),
      images: [ad.image_url_1],
    },
  };
}

export default function ItemLayout({ children }) {
  return <>{children}</>;
}