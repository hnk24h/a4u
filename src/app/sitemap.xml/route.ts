import {prisma} from "@/lib/prisma";
import {getSiteOrigin} from "@/lib/site-url";

const pageSize = 10000;
const escapeXml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&apos;");

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await prisma.story.count();
  const pages = Math.max(1, Math.ceil(count / pageSize));
  const base = getSiteOrigin();
  const entries = Array.from({length: pages}, (_, page) =>
    `<sitemap><loc>${escapeXml(`${base}/sitemap/${page}.xml`)}</loc></sitemap>`,
  ).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
