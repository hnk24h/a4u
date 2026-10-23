import {notFound} from "next/navigation";
import {Header} from "@/components/header";
import {SavedStories} from "@/components/saved-stories";
import {isLocale,type Locale} from "@/lib/i18n";
export default async function BookmarksPage({params}:{params:Promise<{locale:string}>}){const {locale:raw}=await params;if(!isLocale(raw))notFound();const locale:Locale=raw;return <><Header locale={locale}/><SavedStories locale={locale}/></>}
