import sharp from "sharp";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image"); // ইউজার যে ছবিটা আপলোড করেছে

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // ১. ফাইলটাকে বাফারে (Buffer) রূপান্তর করা
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ২. **SHARP** দিয়ে ম্যাজিক শুরু!
    // এখানে ছবি কম্প্রেস করা হচ্ছে এবং সাইজ ছোট করা হচ্ছে
    const compressedBuffer = await sharp(buffer)
      .resize(1024) // ইমেজের প্রস্থ (Width) সর্বোচ্চ ১০২৪ পিক্সেল হবে, উচ্চতা অটোমেটিক সেট হবে
      .jpeg({ quality: 80 }) // ছবির ফরম্যাট .jpeg হবে এবং কোয়ালিটি ৮০% থাকবে (বোঝা যাবে না পার্থক্য)
      .toBuffer();

    // ৩. এখন এই 'compressedBuffer' টিকে সুপাবেসে আপলোড কর
    const fileName = `ads/${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from("ads-bucket")
      .upload(fileName, compressedBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) throw error;

    return NextResponse.json({ url: fileName }, { status: 200 });

  } catch (error) {
    console.error("Error compressing image:", error.message);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}