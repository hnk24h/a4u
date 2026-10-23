"use client";
import {useEffect,useState} from "react";
import type {Locale} from "@/lib/i18n";
const labels:Record<Locale,{save:string;saved:string}>={vi:{save:"Lưu tin",saved:"Đã lưu"},en:{save:"Save story",saved:"Saved"},ja:{save:"記事を保存",saved:"保存済み"},ko:{save:"뉴스 저장",saved:"저장됨"}};
const key="it-digest-bookmarks";
export function readBookmarks(){if(typeof window==="undefined")return[];try{return JSON.parse(localStorage.getItem(key)??"[]") as string[]}catch{return[]}}
export function BookmarkButton({id,locale}:{id:string;locale:Locale}){const [saved,setSaved]=useState(false);useEffect(()=>setSaved(readBookmarks().includes(id)),[id]);function toggle(){const next=readBookmarks();const updated=saved?next.filter(value=>value!==id):[...new Set([...next,id])];localStorage.setItem(key,JSON.stringify(updated));setSaved(!saved);window.dispatchEvent(new Event("it-digest-bookmarks-change"))}return <button className={`bookmark-button ${saved?"is-saved":""}`} onClick={toggle} aria-pressed={saved} aria-label={saved?labels[locale].saved:labels[locale].save} title={saved?labels[locale].saved:labels[locale].save}>{saved?"★":"☆"}</button>}
