export type Region="WORLD"|"VIETNAM";
export type NewsStory={id:string;slug?:string;title:string;summary:string;category:string;region:Region;score:number;time:string;source:string;sourceUrl?:string;sources:number;image:string;highlights:string[]};
export const categories=["All topics","AI","Cloud","Security","Development","DevOps","Open Source","Startup","Big Tech","AI Việt Nam","Chuyển đổi số","CNTT doanh nghiệp","Chính sách"];
