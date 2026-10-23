import Link from "next/link";
import {redirect} from "next/navigation";
import {isAdminAuthenticated,adminAuthConfigured} from "@/lib/admin-auth";
import {AdminLoginForm} from "@/components/admin/admin-login-form";
export const dynamic="force-dynamic";
export default async function AdminLoginPage({searchParams}:{searchParams:Promise<{next?:string}>}){if(await isAdminAuthenticated())redirect("/admin/sources");const query=await searchParams;const nextPath=query.next?.startsWith("/admin/")&&!query.next.startsWith("//")?query.next:"/admin/sources";return <main className="admin-page"><section className="admin-login-card"><Link href="/" className="admin-brand">it digest <span>CMS</span></Link><h1>Đăng nhập quản trị</h1><p>Đăng nhập để cài đặt các nguồn thu thập tin.</p>{adminAuthConfigured()?<AdminLoginForm nextPath={nextPath}/>:<div className="admin-error">Chưa cấu hình CMS. Hãy đặt <code>ADMIN_USERNAME</code>, <code>ADMIN_PASSWORD</code> và <code>ADMIN_SESSION_SECRET</code> trong môi trường chạy ứng dụng.</div>}</section></main>}
