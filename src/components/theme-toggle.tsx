"use client";
import {useEffect,useState} from "react";
import type {Locale} from "@/lib/i18n";
const labels:Record<Locale,{light:string;dark:string}>={vi:{light:"Bật giao diện tối",dark:"Bật giao diện sáng"},en:{light:"Enable dark mode",dark:"Enable light mode"},ja:{light:"ダークモードにする",dark:"ライトモードにする"},ko:{light:"다크 모드 켜기",dark:"라이트 모드 켜기"}};
export function ThemeToggle({locale}:{locale:Locale}){const [dark,setDark]=useState(false);useEffect(()=>{const enabled=localStorage.getItem("it-digest-theme")==="dark";setDark(enabled);document.documentElement.dataset.theme=enabled?"dark":"light"},[]);function toggle(){const enabled=!dark;setDark(enabled);localStorage.setItem("it-digest-theme",enabled?"dark":"light");document.documentElement.dataset.theme=enabled?"dark":"light"}return <button className="theme-toggle" type="button" onClick={toggle} aria-label={dark?labels[locale].dark:labels[locale].light} title={dark?labels[locale].dark:labels[locale].light}>{dark?"☀":"☾"}</button>}
