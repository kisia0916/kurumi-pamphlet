import { NextRequest, NextResponse } from "next/server";

function isExcludedPath(pathname: string): boolean {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/internal/publish-status") ||
    pathname === "/favicon.ico"
  ) {
    return true;
  }

  // public 配下の静的ファイルは拡張子で素通し
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  let isPublished = false;

  try {
    const statusUrl = new URL("/api/internal/publish-status", request.url);
    const response = await fetch(statusUrl, {
      cache: "no-store",
      headers: {
        "x-middleware-check": "1",
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { isPublished?: boolean };
      isPublished = Boolean(data.isPublished);
    }
  } catch (error) {
    console.error("middleware publish-state check failed", error);
  }

  if (isPublished) {
    if (pathname.startsWith("/maintenance")) {
      const appUrl = request.nextUrl.clone();
      appUrl.pathname = "/";
      appUrl.search = "";
      return NextResponse.redirect(appUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "準備中です" }, { status: 503 });
  }

  const maintenanceUrl = request.nextUrl.clone();
  maintenanceUrl.pathname = "/maintenance";
  maintenanceUrl.search = "";

  return NextResponse.redirect(maintenanceUrl);
}

export const config = {
  matcher: ["/:path*"],
};
