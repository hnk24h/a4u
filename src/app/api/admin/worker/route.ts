import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import {isAdminAuthenticated} from "@/lib/admin-auth";
import {prisma} from "@/lib/prisma";
import {ingestQueue} from "@/lib/queue";
const schema=z.object({ingestionEnabled:z.boolean(),pollIntervalMinutes:z.number().int().min(5).max(1440)});
export async function GET(){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});const settings=await prisma.workerSetting.upsert({where:{id:"default"},create:{id:"default"},update:{}});return NextResponse.json({settings})}
export async function PATCH(request:NextRequest){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});const body=schema.safeParse(await request.json().catch(()=>null));if(!body.success)return NextResponse.json({error:"Khoảng thu thập phải từ 5 đến 1.440 phút."},{status:400});const settings=await prisma.workerSetting.upsert({where:{id:"default"},create:{id:"default",...body.data},update:body.data});if(settings.ingestionEnabled)await ingestQueue.upsertJobScheduler("rss-every-30m",{every:settings.pollIntervalMinutes*60*1000},{name:"fetch-feeds"});else await ingestQueue.removeJobScheduler("rss-every-30m");return NextResponse.json({settings})}
