"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {categories,type NewsStory} from "@/lib/news";
import {messages,type Locale} from "@/lib/i18n";
import {BookmarkButton,readBookmarks,readBookmarkedSources} from "@/components/bookmark-button";
import {NewsletterForm} from "@/components/newsletter-form";
import {RefreshStoriesButton} from "@/components/refresh-stories-button";
type Story=NewsStory;
const readSourceLabel:Record<Locale,string>={vi:"Đọc tại nguồn ↗",en:"Read at source ↗",ja:"配信元で読む ↗",ko:"원문 출처에서 읽기 ↗"};
export function StoryCard({story,locale}:{story:Story;locale:Locale}){const t=messages[locale],source=story.sourceUrl;return <article className="story"><Link className="story-card-hitarea" href={`/${locale}/story/${story.slug??story.id}`} aria-label={story.title}/><div className="thumb" style={{background:story.image}}>{story.region==="WORLD"?"✦":"✳"}</div><div><div className="storymeta"><span className={`tag ${story.region==="VIETNAM"?"vn":""}`}>{story.region==="WORLD"?t.regionWorld:t.regionVietnam}</span><span>{t.cats[story.category as keyof typeof t.cats]??story.category}</span><span>·</span><span>{story.time}</span></div><h3>{story.title}</h3><p>{story.summary}</p><div className="source">{t.source}: {source?<a href={source} target="_blank" rel="noopener noreferrer">{story.source}</a>:story.source} &nbsp;·&nbsp; {story.sources} {t.sources}{source&&<a className="read-source-link" href={source} target="_blank" rel="noopener noreferrer">{readSourceLabel[locale]}</a>}</div></div><div className="story-actions"><div className="score">{story.score}<small>{t.score}</small></div><BookmarkButton id={story.id} locale={locale} sources={[story.source]}/></div></article>}
export function GridStoryCard({story,locale}:{story:Story;locale:Locale}){const t=messages[locale],highlights=story.highlights.slice(0,2);return <article className="story-tile"><Link className="story-card-hitarea" href={`/${locale}/story/${story.slug??story.id}`} aria-label={story.title}/><div className="tile-accent" style={{background:story.image}}/><div className="tile-topline"><span className={`tag ${story.region==="VIETNAM"?"vn":""}`}>{story.region==="WORLD"?t.regionWorld:t.regionVietnam}</span><span className="tile-time">{story.time}</span></div><div className="tile-category">{t.cats[story.category as keyof typeof t.cats]??story.category}</div><h3>{story.title}</h3><p className="tile-summary">{story.summary}</p>{highlights.length>0&&<div className="tile-highlights"><span className="tile-highlight-label">✦ {locale==="vi"?"ĐIỂM NHẤN":locale==="ja"?"要点":locale==="ko"?"핵심 포인트":"KEY POINTS"}</span>{highlights.map((item,index)=><div className="tile-highlight" key={`${story.id}-highlight-${index}`}><span>↗</span><span>{item}</span></div>)}</div>}<div className="tile-footer"><span className="tile-source">{story.source}{story.sources>1?` +${story.sources-1}`:""}</span><div className="tile-actions"><span className="tile-score">{story.score}<small>{t.score}</small></span><BookmarkButton id={story.id} locale={locale} sources={[story.source]}/></div></div></article>}
export function HomeFeed({locale,stories,dataUpdatedAt}:{locale:Locale;stories:Story[];dataUpdatedAt:string|null}){
  const t=messages[locale];
  const [region,setRegion]=useState("ALL"),[category,setCategory]=useState("All topics"),[query,setQuery]=useState(""),[view,setView]=useState<"list"|"grid">("list"),[bookmarkSources,setBookmarkSources]=useState<string[]>([]),[sidebarCollapsed,setSidebarCollapsed]=useState(true);
  useEffect(()=>{
    if(localStorage.getItem("it-digest-top-view")==="grid")setView("grid");
    const syncBookmarks=()=>{const ids=readBookmarks(),savedSources=readBookmarkedSources();const inferred=stories.filter(s=>ids.includes(s.id)).map(s=>s.source);setBookmarkSources([...new Set([...Object.values(savedSources).flat(),...inferred].map(source=>source.toLocaleLowerCase(locale)))])};
    syncBookmarks();window.addEventListener("it-digest-bookmarks-change",syncBookmarks);window.addEventListener("storage",syncBookmarks);
    return()=>{window.removeEventListener("it-digest-bookmarks-change",syncBookmarks);window.removeEventListener("storage",syncBookmarks)};
  },[stories,locale]);
  function changeView(next:"list"|"grid"){setView(next);localStorage.setItem("it-digest-top-view",next)}
  const filtered=useMemo(()=>stories.filter(s=>(region==="ALL"||s.region===region)&&(category==="All topics"||s.category===category)&&(`${s.title} ${s.summary} ${s.category}`.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)))),[region,category,query,locale,stories]);
  const sortForUser=(items:Story[])=>[...items].sort((a,b)=>{const ap=bookmarkSources.includes(a.source.toLocaleLowerCase(locale))?1:0,bp=bookmarkSources.includes(b.source.toLocaleLowerCase(locale))?1:0;return bp-ap||b.score-a.score});
  const vietnamStories=stories.filter(s=>s.region==="VIETNAM");
  const renderStories=(items:Story[])=>{const ranked=sortForUser(items);return ranked.length?(view==="grid"?<div className="story-grid">{ranked.map(s=><GridStoryCard key={s.id} story={s} locale={locale}/>)}</div>:<div className="storylist">{ranked.map(s=><StoryCard key={s.id} story={s} locale={locale}/>)}</div>):<div className="empty">{t.noResults}</div>};
  return <div className={`grid home-layout ${sidebarCollapsed?"sidebar-collapsed":""}`}>
    <section className="home-main">
      <div className="sectionhead"><div><h2>{t.top}</h2><p>{t.updatedDate}</p></div><div className="sectionhead-actions"><NewsletterForm locale={locale}/><RefreshStoriesButton locale={locale} dataUpdatedAt={dataUpdatedAt}/><button className="sidebar-toggle" onClick={()=>setSidebarCollapsed(value=>!value)} aria-expanded={!sidebarCollapsed} aria-label={sidebarCollapsed?t.expandSidebar:t.collapseSidebar} title={sidebarCollapsed?t.expandSidebar:t.collapseSidebar}><span aria-hidden="true">{sidebarCollapsed?"»":"«"}</span><span className="sidebar-toggle-label">{sidebarCollapsed?t.expandSidebar:t.collapseSidebar}</span></button></div></div>
      {renderStories(filtered)}
      <div className="regionhead"><h2><span>🇻🇳</span>{t.vietnamBrief}</h2><p>{t.vietnamSub}</p></div>
      <div style={{marginTop:14}}>{renderStories(vietnamStories)}</div>
    </section>
    <aside className="sidebar home-sidebar">
      <div className="sidebar-content">
      <div className="sidecard feed-controls">
        <div className="feed-control-heading"><h3>{t.top}</h3><div className="view-switch" role="group" aria-label={t.viewMode}><button className={view==="list"?"selected":""} aria-pressed={view==="list"} onClick={()=>changeView("list")} title={t.listView} aria-label={t.listView}><span className="view-icon list-icon" aria-hidden="true"/></button><button className={view==="grid"?"selected":""} aria-pressed={view==="grid"} onClick={()=>changeView("grid")} title={t.gridView} aria-label={t.gridView}><span className="view-icon grid-icon" aria-hidden="true"/></button></div></div>
        <div className="side-filter-tabs"><button className={region==="ALL"?"selected":""} onClick={()=>setRegion("ALL")}>{t.all}</button><button className={region==="WORLD"?"selected":""} onClick={()=>setRegion("WORLD")}>🌎 {t.world}</button><button className={region==="VIETNAM"?"selected":""} onClick={()=>setRegion("VIETNAM")}>🇻🇳 {t.vietnam}</button></div>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} className="feed-filter" aria-label={t.search}/>
        <div id="topics" className="side-topic-list">{["All topics",...categories.filter(c=>c!=="All topics").slice(0,8)].map((c,index)=><button key={index===0?"all-topics":`category-${index}-${c}`} onClick={()=>setCategory(c)} className={`topic ${category===c?"active":""}`}>{c==="All topics"?t.allTopics:t.cats[c as keyof typeof t.cats]??c}</button>)}</div>
      </div>
      <div className="sidecard"><div className="sidehead"><h3>{t.trending}</h3><Link href={`/${locale}/trends`} style={{fontSize:11,color:"#2563eb"}}>{t.seeAll}</Link></div>{t.trendsList.map((n,i)=><div className="trend" key={n}><span className="trendnum">{i+1}</span><span className="trendname">{n}</span><span className={`trenddelta ${i===4?"red":""}`}>+{[24,18,13,9,7][i]}%</span></div>)}</div>
      <div className="sidecard"><div className="sidehead"><h3>{t.explore}</h3><span style={{fontSize:18}}>⌘</span></div><div>{t.exploreList.map((x,i)=><span key={x} className="topic">{["✧","☁","◈","⌘","🇻🇳","↗"][i]} &nbsp;{x}</span>)}</div></div>
      </div>
    </aside>
  </div>
}
