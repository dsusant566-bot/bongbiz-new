// src/lib/utils.js - FINAL CODE

export const createSlug = (item) => {
  if (!item || !item.title || !item.id) return item?.id || "";
  
  const cleanTitle = item.title.split(',')[0];
  const cleanLocation = item.location ? item.location.split(',')[0] : "";

  const base = `${cleanTitle}-${cleanLocation}`
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  return `${base}-${item.id}`;
};

export const getIdFromSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return "";
  const parts = slug.split('-');
  
  // UUID (৩৬ অক্ষরের আইডি) সবসময় ৫টি অংশ নিয়ে গঠিত হয়। 
  // তাই শেষ থেকে ৫টি অংশ নিয়ে পুরো আইডিটি বের করা হলো।
  if (parts.length >= 5) {
    return parts.slice(-5).join('-');
  }
  return parts[parts.length - 1]; 
};