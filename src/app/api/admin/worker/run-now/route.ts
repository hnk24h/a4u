import {NextResponse} from "next/server";
import {isAdminAuthenticated} from "@/lib/admin-auth";
import {ingestQueue} from "@/lib/queue";
export async function POST(){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});await ingestQueue.add("fetch-feeds",{},{jobId:`admin-fetch-${Date.now()}`});return NextResponse.json({ok:true,message:"Đã đưa lượt thu thập vào hàng đợi."})}
