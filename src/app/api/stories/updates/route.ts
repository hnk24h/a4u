import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const latestStory = await prisma.story.findFirst({
    orderBy: {updatedAt: "desc"},
    select: {updatedAt: true},
  });

  return NextResponse.json(
    {updatedAt: latestStory?.updatedAt.toISOString() ?? null},
    {headers: {"Cache-Control": "no-store, max-age=0"}},
  );
}
