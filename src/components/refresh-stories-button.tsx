"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import type {Locale} from "@/lib/i18n";

const labels: Record<Locale, {refresh: string; newStories: string}> = {
  vi: {refresh: "Làm mới tin", newStories: "Có tin mới"},
  en: {refresh: "Refresh stories", newStories: "New stories"},
  ja: {refresh: "ニュースを更新", newStories: "新着ニュース"},
  ko: {refresh: "뉴스 새로고침", newStories: "새 뉴스"},
};

export function RefreshStoriesButton({locale, dataUpdatedAt}: {locale: Locale; dataUpdatedAt: string | null}) {
  const router = useRouter();
  const [hasNewStories, setHasNewStories] = useState(false);
  const text = labels[locale];

  useEffect(() => {
    let active = true;
    const baseline = dataUpdatedAt ? Date.parse(dataUpdatedAt) : 0;
    setHasNewStories(false);
    const checkForUpdates = async () => {
      try {
        const response = await fetch("/api/stories/updates", {cache: "no-store"});
        if (!response.ok) return;
        const result = await response.json() as {updatedAt: string | null};
        const latest = result.updatedAt ? Date.parse(result.updatedAt) : 0;
        if (active && latest > baseline) setHasNewStories(true);
      } catch {
        // Keep the refresh control available if the update check is temporarily unavailable.
      }
    };

    void checkForUpdates();
    const timer = window.setInterval(() => void checkForUpdates(), 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [dataUpdatedAt]);

  return <button
    type="button"
    className={`stories-refresh ${hasNewStories ? "has-new-stories" : ""}`}
    onClick={() => router.refresh()}
    aria-label={hasNewStories ? text.newStories : text.refresh}
    title={hasNewStories ? text.newStories : text.refresh}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2"/></svg>
    {hasNewStories && <><span className="stories-refresh-dot" aria-hidden="true"/><span className="stories-refresh-label">{text.newStories}</span></>}
  </button>;
}
