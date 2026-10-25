import Link from "next/link";
import {redirect} from "next/navigation";
import {Prisma} from "@prisma/client";
import {AdminNav} from "@/components/admin/admin-nav";
import {Header} from "@/components/header";
import {isAdminAuthenticated} from "@/lib/admin-auth";
import {prisma} from "@/lib/prisma";

export const dynamic = "force-dynamic";
const pageSize = 30;

export default async function AdminArticlesPage({searchParams}: {searchParams: Promise<{q?: string; region?: string; page?: string}>}) {
  if (!await isAdminAuthenticated()) redirect("/admin/login?next=/admin/articles");
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 120) ?? "";
  const region = params.region === "WORLD" || params.region === "VIETNAM" ? params.region : "ALL";
  const requestedPage = Number(params.page ?? "1");
  const requestedPageNumber = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const where: Prisma.ArticleWhereInput = {
    ...(region !== "ALL" ? {region} : {}),
    ...(query ? {OR: [{title: {contains: query, mode: "insensitive" as const}}, {source: {contains: query, mode: "insensitive" as const}}]} : {}),
  };
  const total = await prisma.article.count({where});
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPageNumber, pages);
  const articles = await prisma.article.findMany({
    where,
    orderBy: {createdAt: "desc"},
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {id: true, title: true, url: true, source: true, region: true, category: true, content: true, summary: true, createdAt: true, storyId: true},
  });
  const pageHref = (number: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (region !== "ALL") search.set("region", region);
    search.set("page", String(number));
    return `/admin/articles?${search.toString()}`;
  };

  return <>
    <Header locale="vi" showLogout/>
    <main className="admin-page"><div className="admin-shell">
      <AdminNav current="articles"/>
      <section className="collected-admin">
        <div className="collected-admin-heading"><div><p className="admin-kicker">CMS ADMIN</p><h1>Bài đã thu thập</h1><p>Tra cứu nội dung RSS đã lưu và trạng thái xử lý thành bài tin.</p></div><span className="collected-total">{total.toLocaleString("vi-VN")} bài</span></div>
        <form className="collected-filters" method="get">
          <label>Tìm bài hoặc nguồn<input name="q" defaultValue={query} placeholder="Nhập tiêu đề hoặc tên nguồn"/></label>
          <label>Khu vực<select name="region" defaultValue={region}><option value="ALL">Tất cả</option><option value="WORLD">Thế giới</option><option value="VIETNAM">Việt Nam</option></select></label>
          <button className="admin-button">Lọc bài</button>
        </form>
        <div className="admin-table-wrap collected-table-wrap"><table className="admin-table collected-table"><thead><tr><th>Bài viết</th><th>Nguồn</th><th>Khu vực</th><th>Thu thập lúc</th><th>Trạng thái</th></tr></thead><tbody>
          {articles.map(article => <tr key={article.id}>
            <td><a className="collected-title" href={article.url} target="_blank" rel="noreferrer">{article.title}</a><span className="collected-category">{article.category}</span><p className="collected-excerpt">{article.summary || article.content || "Chưa có nội dung."}</p>{article.content && <details className="collected-content"><summary>Xem nội dung RSS</summary><p>{article.content}</p></details>}</td>
            <td>{article.source}</td><td>{article.region === "VIETNAM" ? "Việt Nam" : "Thế giới"}</td>
            <td><time dateTime={article.createdAt.toISOString()}>{article.createdAt.toLocaleString("vi-VN", {dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh"})}</time></td>
            <td><span className={`collected-status ${article.storyId ? "processed" : "pending"}`}>{article.storyId ? "Đã xử lý" : "Chưa xử lý"}</span></td>
          </tr>)}
        </tbody></table>{articles.length === 0 && <p className="admin-empty">Không tìm thấy bài đã thu thập.</p>}</div>
        <div className="collected-pagination"><span>Trang {page} / {pages}</span><div>{page > 1 && <Link href={pageHref(page - 1)}>← Trước</Link>}{page < pages && <Link href={pageHref(page + 1)}>Sau →</Link>}</div></div>
      </section>
    </div></main>
  </>;
}
