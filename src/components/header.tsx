import Link from "next/link";
import {messages,type Locale} from "@/lib/i18n";
import {ThemeToggle} from "@/components/theme-toggle";
import {HeaderSearch} from "@/components/header-search";
import {HeaderMenus} from "@/components/header-menus";
import {HeaderLogout} from "@/components/admin/header-logout";
const brandTagline:Record<Locale,string>={vi:"Trợ lý công nghệ của bạn",en:"Your tech assistant",ja:"あなたのテックアシスタント",ko:"나만의 테크 도우미"};
export function Header({locale,showLogout=false}:{locale:Locale;showLogout?:boolean}){const t=messages[locale];return <header className="topbar"><div className="shell topinner"><Link className="brand" href={`/${locale}`} aria-label={`A4U — ${brandTagline[locale]}`}><span className="brandmark">A</span><span className="brand-copy"><strong>A4U</strong><small>{brandTagline[locale]}</small></span></Link><div className="actions"><HeaderSearch locale={locale} placeholder={t.search}/><div className="header-tools"><ThemeToggle locale={locale}/><HeaderMenus locale={locale}/><div className="avatar">H</div>{showLogout&&<HeaderLogout/>}</div></div></div></header>}
