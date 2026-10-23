import {NextResponse} from "next/server";
import {z} from "zod";
import {isAdminAuthenticated} from "@/lib/admin-auth";
import {ingestQueue} from "@/lib/queue";
import {prisma} from "@/lib/prisma";
const bodySchema=z.object({sourceIds:z.array(z.string().min(1)).min(1).max(200)});
export async function POST(request:Request){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});const parsed=bodySchema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Hãy chọn ít nhất một nguồn để thu thập."},{status:400});const uniqueIds=[...new Set(parsed.data.sourceIds)];const sources=await prisma.source.findMany({where:{id:{in:uniqueIds}},select:{id:true}});if(sources.length!==uniqueIds.length)return NextResponse.json({error:"Một hoặc nhiều nguồn không còn tồn tại. Hãy tải lại trang."},{status:400});await ingestQueue.add("fetch-feeds",{sourceIds:uniqueIds},{jobId:`admin-fetch-${Date.now()}`,removeOnComplete:{age:3600,count:100}});return NextResponse.json({ok:true,message:`Đã đưa ${uniqueIds.length} nguồn vào hàng đợi thu thập.`})}
