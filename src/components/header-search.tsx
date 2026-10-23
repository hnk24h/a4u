"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import type {Locale} from "@/lib/i18n";

type Suggestion={id:string;slug:string|null;title:string;summary:string;category:string;score:number};
const labels:Record<Locale,{title:string;loading:string;empty:string}>={
  vi:{title:"Tin nổi bật hôm nay",loading:"Đang tải tin…",empty:"Hôm nay chưa có tin phù hợp."},
  en:{title:"Top stories today",loading:"Loading stories…",empty:"No matching stories today."},
  ja:{title:"今日の注目ニュース",loading:"ニュースを読み込み中…",empty:"今日のニュースはありません。"},
  ko:{title:"오늘의 주요 뉴스",loading:"뉴스 불러오는 중…",empty:"오늘 일치하는 뉴스가 없습니다."},
};

export function HeaderSearch({locale,placeholder}:{locale:Locale;placeholder:string}){
  const [query,setQuery]=useState("");
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);
  const [stories,setStories]=useState<Suggestion[]>([]);
  const root=useRef<HTMLDivElement>(null);
  const t=labels[locale];

  useEffect(()=>{
    if(!open)return;
    const controller=new AbortController();
    const timer=window.setTimeout(async()=>{
      setLoading(true);
      const now=new Date(),from=new Date(now);from.setHours(0,0,0,0);
      const params=new URLSearchParams({from:from.toISOString(),to:now.toISOString(),limit:"5"});
      if(query.trim())params.set("q",query.trim());
      try{
        const response=await fetch(`/api/stories?${params}`,{signal:controller.signal});
        if(!response.ok)throw new Error("Could not load suggestions");
        const result=await response.json() as {data:Suggestion[]};
        setStories(result.data.slice(0,5));
      }catch(error){if(!controller.signal.aborted)setStories([])}
      finally{if(!controller.signal.aborted)setLoading(false)}
    },query.trim()?220:0);
    return()=>{window.clearTimeout(timer);controller.abort()};
  },[open,query]);

  useEffect(()=>{
    const onPointerDown=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
    document.addEventListener("pointerdown",onPointerDown);document.addEventListener("keydown",onKeyDown);
    return()=>{document.removeEventListener("pointerdown",onPointerDown);document.removeEventListener("keydown",onKeyDown)};
  },[]);

  return <div className="header-search-wrap" ref={root}>
    <form className="searchbox" action={`/${locale}/search`} onSubmit={()=>setOpen(false)}>
      <span aria-hidden="true">⌕</span>
      <input name="q" value={query} onChange={event=>setQuery(event.target.value)} onFocus={()=>setOpen(true)} placeholder={placeholder} aria-label={placeholder} aria-expanded={open} aria-controls="header-story-suggestions" autoComplete="off"/>
      <kbd style={{fontSize:10,color:"#9aa2af"}}>⌘ K</kbd>
    </form>
    {open&&<div className="header-suggestions" id="header-story-suggestions" role="region" aria-label={t.title}>
      <div className="suggestion-heading">{t.title}</div>
      {loading?<div className="suggestion-status">{t.loading}</div>:stories.length?stories.map(story=><Link className="story-suggestion" key={story.id} href={`/${locale}/story/${story.slug??story.id}`} onClick={()=>setOpen(false)}>
        <span className="suggestion-meta">{story.category}<span>·</span>{story.score} {locale==="vi"?"điểm":locale==="ja"?"点":locale==="ko"?"점":"pts"}</span>
        <strong>{story.title}</strong>
        <span className="suggestion-summary">{story.summary}</span>
      </Link>):<div className="suggestion-status">{t.empty}</div>}
    </div>}
  </div>;
}
