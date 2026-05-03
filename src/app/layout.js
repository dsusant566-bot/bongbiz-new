import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; 
import FloatingButtons from "@/components/FloatingButtons";
import AuthProvider from "@/components/AuthProvider";
import { GoogleAnalytics } from '@next/third-parties/google'; // এটি যোগ করা হয়েছে

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BongoBiz | Classified Marketplace",
  description: "Buy and sell items in West Bengal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-gray-50`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingButtons />
        </AuthProvider>
        {/* গুগল অ্যানালিটিক্স কোড এখানে থাকবে */}
        <GoogleAnalytics gaId="G-DGJRYV2VF5" />
      </body>
    </html>
  );
}