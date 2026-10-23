import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import {isAdminAuthenticated} from "@/lib/admin-auth";
import {prisma} from "@/lib/prisma";
import {validFeedUrl} from "@/lib/admin-sources";
const schema=z.object({name:z.string().trim().min(1).max(120),url:z.string().trim().url().max(2000),region:z.enum(["WORLD","VIETNAM"]),enabled:z.boolean().optional()});
export async function GET(){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});const sources=await prisma.source.findMany({orderBy:[{region:"asc"},{name:"asc"}],include:{_count:{select:{articles:true}}}});return NextResponse.json({sources})}
export async function POST(request:NextRequest){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Kiểm tra lại tên, URL HTTPS và khu vực."},{status:400});if(!validFeedUrl(parsed.data.url))return NextResponse.json({error:"Nguồn phải dùng URL HTTPS công khai."},{status:400});try{const source=await prisma.source.create({data:{...parsed.data,enabled:parsed.data.enabled??true}});return NextResponse.json({source},{status:201})}catch(error){if((error as {code?:string}).code==="P2002")return NextResponse.json({error:"URL này đã được thêm."},{status:409});throw error}}
