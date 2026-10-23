import type { Metadata } from "next";
import {isLocale} from "@/lib/i18n";
import "./globals.css";
export const metadata: Metadata = { title:"IT Digest — Your daily technology briefing", description:"The most important technology news from around the world and Vietnam, summarized in five minutes.", openGraph:{title:"IT Digest",description:"Your daily technology briefing",type:"website"} };
export default async function RootLayout({children,params}:{children:React.ReactNode;params?:Promise<{locale?:string}>}){const routeParams=params?await params:{};const lang=routeParams.locale&&isLocale(routeParams.locale)?routeParams.locale:"vi";return <html lang={lang}><body>{children}</body></html>}
