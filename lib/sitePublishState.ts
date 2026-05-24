import { prisma } from "@/lib/prisma";

const CACHE_MS = Number(process.env.SITE_PUBLISH_CACHE_MS ?? "10000");

let cached: { value: boolean; expiresAt: number } | null = null;

export async function getSitePublishedState(): Promise<boolean> {
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  try {
    const state = await prisma.sitePublicationState.findUnique({
      where: { id: "global" },
      select: { isPublished: true },
    });

    const isPublished = state?.isPublished ?? false;
    cached = {
      value: isPublished,
      expiresAt: now + CACHE_MS,
    };

    return isPublished;
  } catch (error) {
    // DB障害時は安全側として準備中に倒す
    console.error("Failed to fetch site publication state", error);
    cached = {
      value: false,
      expiresAt: now + CACHE_MS,
    };
    return false;
  }
}
