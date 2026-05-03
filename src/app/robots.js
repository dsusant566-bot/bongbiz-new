// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // যদি কোনো পেজ হাইড রাখতে চান
    },
    sitemap: 'https://bongobiz.com/sitemap.xml',
  }
}