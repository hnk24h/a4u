import Link from "next/link";
import {notFound} from "next/navigation";
import {Header} from "@/components/header";
import {BookmarkButton} from "@/components/bookmark-button";
import {prisma} from "@/lib/prisma";
import {isLocale,type Locale,messages} from "@/lib/i18n";

const labels:Record<Locale,{sources:string;timeline:string;related:string;original:string;published:string;keyPoints:string}>={
  vi:{sources:"Nguồn bài viết",timeline:"Diễn biến theo thời gian",related:"Tin liên quan",original:"Đọc bài gốc ↗",published:"Đăng lúc",keyPoints:"Điểm chính"},
  en:{sources:"Sources",timeline:"Story timeline",related:"Related stories",original:"Read original ↗",published:"Published",keyPoints:"Key takeaways"},
  ja:{sources:"情報源",timeline:"ニュースの経過",related:"関連記事",original:"元記事を読む ↗",published:"公開日時",keyPoints:"要点"},
  ko:{sources:"출처",timeline:"뉴스 타임라인",related:"관련 뉴스",original:"원문 읽기 ↗",published:"게시 시간",keyPoints:"핵심 요약"},
};
export const dynamic="force-dynamic";

export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}){
  const {locale:raw,slug}=await params;
  if(!isLocale(raw))return{};
  const story=await prisma.story.findFirst({where:{OR:[{slug},{id:slug}]},select:{title:true,summary:true}});
  return story?{title:`${story.title} — IT Digest`,description:story.summary.slice(0,160)}:{};
}

export default async function StoryPage({params}:{params:Promise<{locale:string;slug:string}>}){
  const {locale:raw,slug}=await params;
  if(!isLocale(raw))notFound();
  const locale:Locale=raw,t=labels[locale],copy=messages[locale];
  const story=await prisma.story.findFirst({where:{OR:[{slug},{id:slug}]},include:{articles:{orderBy:[{publishedAt:"asc"},{createdAt:"asc"}]}}});
  if(!story)notFound();
  const highlights=Array.isArray(story.highlights)?story.highlights.filter((item):item is string=>typeof item==="string"):[];
  const related=await prisma.story.findMany({where:{category:story.category,region:story.region,id:{not:story.id}},orderBy:{score:"desc"},take:4,select:{id:true,slug:true,title:true,summary:true,score:true,category:true}});
  const regionLabel=story.region==="WORLD"?copy.regionWorld:copy.regionVietnam;

  return <>
    <Header locale={locale}/>
    <main className="shell page story-page-layout" lang={locale}>
      <article className="story-detail story-page-content">
        <div className="story-detail-top"><span className={`tag ${story.region==="VIETNAM"?"vn":""}`}>{regionLabel}</span><span className="tag">{copy.cats[story.category as keyof typeof copy.cats]??story.category}</span><BookmarkButton id={story.id} locale={locale} sources={[...new Set(story.articles.map(article=>article.source))]}/></div>
        <h1>{story.title}</h1>
        <p className="story-detail-summary">{story.summary}</p>
        <div className="story-detail-score">{story.score} / 100</div>
        {highlights.length>0&&<section className="sidecard story-highlights"><h2>{t.keyPoints}</h2><ul>{highlights.map((item,i)=><li key={i}>{item}</li>)}</ul></section>}
        <section className="detail-section"><h2>{t.sources} ({story.articles.length})</h2><div className="source-list">{story.articles.map(article=><article key={article.id} className="source-item"><div><strong>{article.source}</strong><p>{article.title}</p><small>{article.language.toUpperCase()} {article.publishedAt?` · ${t.published}: ${new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short"}).format(article.publishedAt)}`:""}</small></div><a href={article.url} target="_blank" rel="noopener noreferrer">{t.original}</a></article>)}</div></section>
        <section className="detail-section"><h2>{t.timeline}</h2><ol className="timeline">{story.articles.map(article=><li key={article.id}><time>{article.publishedAt?new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short"}).format(article.publishedAt):new Intl.DateTimeFormat(locale,{dateStyle:"medium"}).format(article.createdAt)}</time><strong>{article.source}</strong><p>{article.summary??article.title}</p></li>)}</ol></section>
      </article>
      <aside className="story-page-sidebar">
        <section className="sidecard story-aside-trends"><div className="sidehead"><h2>{copy.trending}</h2><Link href={`/${locale}/trends`}>{copy.seeAll}</Link></div>{copy.trendsList.map((name,index)=><div className="trend" key={name}><span className="trendnum">{index+1}</span><span className="trendname">{name}</span><span className={`trenddelta ${index===4?"red":""}`}>+{[24,18,13,9,7][index]}%</span></div>)}</section>
        {related.length>0&&<section className="sidecard story-related-sidebar"><div className="sidehead"><h2>{t.related}</h2></div>{related.map(item=><Link key={item.id} className="story-sidebar-related" href={`/${locale}/story/${item.slug??item.id}`}><span>{item.category} · {item.score}</span><strong>{item.title}</strong><small>{item.summary}</small></Link>)}</section>}
        <section className="sidecard story-aside-explore"><div className="sidehead"><h2>{copy.explore}</h2></div>{copy.exploreList.map((item,index)=><span className="topic" key={item}>{["✧","☁","◈","⌘","🇻🇳","↗"][index]} &nbsp;{item}</span>)}</section>
      </aside>
    </main>
  </>;
}
