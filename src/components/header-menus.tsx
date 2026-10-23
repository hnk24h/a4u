"use client";

import Link from "next/link";
import {useEffect,useRef} from "react";
import {localeNames,locales,messages,type Locale} from "@/lib/i18n";

const navLabels:Record<Locale,{saved:string;analytics:string;admin:string}>={vi:{saved:"Đã lưu",analytics:"Nguồn tin",admin:"CMS Admin"},en:{saved:"Saved",analytics:"Source health",admin:"CMS Admin"},ja:{saved:"保存済み",analytics:"ソース状況",admin:"CMS管理"},ko:{saved:"저장한 뉴스",analytics:"수집 상태",admin:"CMS 관리"}};

export function HeaderMenus({locale}:{locale:Locale}){
  const root=useRef<HTMLDivElement>(null);
  const language=useRef<HTMLDetailsElement>(null);
  const navigation=useRef<HTMLDetailsElement>(null);
  const closeMenus=()=>{if(language.current)language.current.open=false;if(navigation.current)navigation.current.open=false};

  useEffect(()=>{
    const onPointerDown=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))closeMenus()};
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==="Escape")closeMenus()};
    document.addEventListener("pointerdown",onPointerDown);
    document.addEventListener("keydown",onKeyDown);
    return()=>{document.removeEventListener("pointerdown",onPointerDown);document.removeEventListener("keydown",onKeyDown)};
  },[]);

  const closeOther=(current:"language"|"navigation")=>()=>{
    if(current!=="language"&&language.current)language.current.open=false;
    if(current!=="navigation"&&navigation.current)navigation.current.open=false;
  };
  const nav=navLabels[locale],t=messages[locale];

  return <div className="header-menu-controls" ref={root} onClick={event=>{if((event.target as HTMLElement).closest("a"))closeMenus()}}>
    <details className="language-menu" ref={language} onToggle={closeOther("language")}>
      <summary aria-label="Choose language">🌐 <span>{locale.toUpperCase()}</span></summary>
      <div className="language-options">{locales.map(code=><Link key={code} href={`/${code}`} lang={code} hrefLang={code} aria-current={locale===code?"page":undefined}>{localeNames[code]}</Link>)}</div>
    </details>
    <details className="mobile-nav" ref={navigation} onToggle={closeOther("navigation")}>
      <summary aria-label="Open navigation">☰</summary>
      <div className="language-options nav-dropdown"><Link href={`/${locale}`}>{t.today}</Link><Link href={`/${locale}?view=week`}>{t.week}</Link><Link href={`/${locale}/trends`}>{t.trends}</Link><Link href={`/${locale}#topics`}>{t.topics}</Link><Link href={`/${locale}/bookmarks`}>{nav.saved}</Link><Link href={`/${locale}/analytics`}>{nav.analytics}</Link><Link href="/admin">{nav.admin}</Link></div>
    </details>
  </div>;
}
