import {NextResponse} from "next/server";
export function GET(){return NextResponse.json({status:"ok",service:"it-digest",timestamp:new Date().toISOString()})}
