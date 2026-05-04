import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // যদি ইউজার কোনো নির্দিষ্ট পেজে যাওয়ার চেষ্টা করে (যেমন /post-ad)
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // যদি অন্য কোনো URL হয় কিন্তু সেটা আপনার সাইটেরই হয়
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };