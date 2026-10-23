import type { Metadata } from "next";
import {isLocale} from "@/lib/i18n";
import "./globals.css";
export const metadata: Metadata = { title:"A4U — Your tech assistant", description:"Your personal assistant for technology news from around the world and Vietnam.", openGraph:{title:"A4U",description:"Your personal assistant for technology news",type:"website"} };
export default async function RootLayout({children,params}:{children:React.ReactNode;params?:Promise<{locale?:string}>}){const routeParams=params?await params:{};const lang=routeParams.locale&&isLocale(routeParams.locale)?routeParams.locale:"vi";return <html lang={lang}><body>{children}</body></html>}
