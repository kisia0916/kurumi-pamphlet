import { NextResponse } from "next/server";
import { getSitePublishedState } from "@/lib/sitePublishState";

export async function GET() {
  const isPublished = await getSitePublishedState();
  return NextResponse.json({ isPublished }, { status: 200 });
}
