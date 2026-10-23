import {notFound} from "next/navigation";
import {Header} from "@/components/header";
import {HomeFeed} from "@/components/home-feed";
import {isLocale,locales,messages,type Locale} from "@/lib/i18n";
import {prisma} from "@/lib/prisma";
import {toNewsStory} from "@/lib/story-view";
export const dynamic="force-dynamic";
export function generateStaticParams(){return locales.map(locale=>({locale}))}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))return{};const title={vi:"IT Digest — Bản tin công nghệ mỗi ngày",en:"IT Digest — Your daily technology briefing",ja:"IT Digest — 毎日のテックニュース",ko:"IT Digest — 매일의 기술 브리핑"}[locale];return{title,description:messages[locale].heroText,alternates:{languages:Object.fromEntries(locales.map(code=>[code,`/${code}`]))}}}
export default async function Home({params}:{params:Promise<{locale:string}>}){const {locale:raw}=await params;if(!isLocale(raw))notFound();const locale:Locale=raw;const records=await prisma.story.findMany({where:{createdAt:{gte:new Date(Date.now()-7*86400000)}},include:{articles:{orderBy:[{publishedAt:"desc"},{createdAt:"desc"}],take:1},_count:{select:{articles:true}}},orderBy:[{score:"desc"},{createdAt:"desc"}],take:30});const stories=records.map(story=>toNewsStory(story,locale));return <><Header locale={locale}/><main className="shell page" lang={locale}><HomeFeed locale={locale} stories={stories}/></main></>}
