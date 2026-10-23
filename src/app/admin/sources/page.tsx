import {redirect} from "next/navigation";
import {isAdminAuthenticated} from "@/lib/admin-auth";
import {prisma} from "@/lib/prisma";
import {SourceManager} from "@/components/admin/source-manager";
import {Header} from "@/components/header";
export const dynamic="force-dynamic";
export default async function AdminSourcesPage(){if(!await isAdminAuthenticated())redirect("/admin/login?next=/admin/sources");const [sources,workerSettings]=await Promise.all([prisma.source.findMany({orderBy:[{region:"asc"},{name:"asc"}],include:{_count:{select:{articles:true}}}}),prisma.workerSetting.upsert({where:{id:"default"},create:{id:"default"},update:{}})]);return <><Header locale="vi" showLogout/><main className="admin-page"><div className="admin-shell"><SourceManager initialSources={sources.map(source=>({...source,lastFetchedAt:source.lastFetchedAt?.toISOString()??null}))} initialWorkerSettings={{ingestionEnabled:workerSettings.ingestionEnabled,pollIntervalMinutes:workerSettings.pollIntervalMinutes}}/></div></main></>}
