import {prisma} from "@/lib/prisma";
const pageSize=10000;
export const dynamic="force-dynamic";
export async function GET(){const count=await prisma.story.count();const pages=Math.max(1,Math.ceil(count/pageSize));const base=(process.env.NEXT_PUBLIC_APP_URL??"http://localhost:3000").replace(/\/$/,"");const entries=Array.from({length:pages},(_,page)=>`<sitemap><loc>${base}/sitemap/${page}.xml</loc></sitemap>`).join("");return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`,{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, s-maxage=3600, stale-while-revalidate=86400"}})}
