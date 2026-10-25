import Link from "next/link";

export function AdminNav({current}: {current: "sources" | "articles"}) {
  return <nav className="admin-nav" aria-label="Quản lý CMS">
    <Link href="/admin/sources" aria-current={current === "sources" ? "page" : undefined}>Nguồn thu thập</Link>
    <Link href="/admin/articles" aria-current={current === "articles" ? "page" : undefined}>Bài đã thu thập</Link>
  </nav>;
}
