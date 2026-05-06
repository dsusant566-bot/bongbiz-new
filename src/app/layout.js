import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; 
import FloatingButtons from "@/components/FloatingButtons";
import AuthProvider from "@/components/AuthProvider";
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BongoBiz - Classified Marketplace",
  description: "The Best Classified Marketplace for Property Developers and Beyond",
  manifest: "/manifest.json", // এখানে সঠিক বানান আছে
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  verification: {
    google: "RoxK-u3FkbPbZcER9b-KnOF60fQQxWXiLd-_5Hc2yck",
  },
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
        <GoogleAnalytics gaId="G-DGJRYV2VF5" />
      </body>
    </html>
  );
}