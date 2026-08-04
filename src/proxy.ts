import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  matchAreaMoneyPrettyPath,
  matchKeywordInGeoPrettyPath,
  matchServiceInCityPrettyPath,
} from "@/lib/routing/pretty-money-urls";

/**
 * Clone the request URL for an *internal* rewrite.
 *
 * Behind nginx, `X-Forwarded-Proto: https` makes `request.nextUrl` report
 * https. Next then treats the rewrite as an external proxy to
 * `https://localhost:<PORT>`, but the Node process only speaks plain HTTP —
 * every rewritten page fails with EPROTO "wrong version number". Force http
 * so the hop stays on the loopback listener.
 */
function internalUrl(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.protocol = "http:";
  return url;
}

/** Next.js 16+ network proxy (replaces deprecated middleware convention). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname !== pathname.toLowerCase() &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  // Keyword × geo money URLs (safety nets / grills / etc. in areas)
  const keywordPretty = matchKeywordInGeoPrettyPath(pathname);
  if (keywordPretty) {
    return NextResponse.rewrite(
      internalUrl(request, keywordPretty.rewritePath),
    );
  }

  // Core /{service}-in-{city}/ → city×service canonical
  const cityPretty = matchServiceInCityPrettyPath(pathname);
  if (cityPretty && pathname !== cityPretty.canonicalPath) {
    const url = request.nextUrl.clone();
    url.pathname = cityPretty.canonicalPath;
    return NextResponse.redirect(url, 308);
  }

  const areaPretty = matchAreaMoneyPrettyPath(pathname);
  if (areaPretty) {
    return NextResponse.rewrite(internalUrl(request, areaPretty.rewritePath));
  }

  const internalKeyword = pathname.match(
    /^\/landings\/keyword\/([a-z0-9-]+)\/in\/([a-z0-9-]+)\/?$/,
  );
  if (internalKeyword) {
    const pretty = `/${internalKeyword[1]}-in-${internalKeyword[2]}/`;
    if (matchKeywordInGeoPrettyPath(pretty)) {
      const url = request.nextUrl.clone();
      url.pathname = pretty;
      return NextResponse.redirect(url, 308);
    }
  }

  const internalArea = pathname.match(
    /^\/landings\/area\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/,
  );
  if (internalArea) {
    const pretty = `/${internalArea[1]}/${internalArea[2]}/${internalArea[3]}/${internalArea[4]}/`;
    if (matchAreaMoneyPrettyPath(pretty)) {
      const url = request.nextUrl.clone();
      url.pathname = pretty;
      return NextResponse.redirect(url, 308);
    }
  }

  if (pathname.startsWith("/admin")) {
    const secret = request.headers.get("x-admin-secret");
    const cookie = request.cookies.get("admin_secret")?.value;
    const expected = process.env.ADMIN_SECRET;

    if (expected && expected !== "change-me-in-production") {
      if (secret !== expected && cookie !== expected) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
