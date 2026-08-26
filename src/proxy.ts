import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  matchAreaMoneyPrettyPath,
  matchKeywordInGeoPrettyPath,
  matchServiceInCityPrettyPath,
} from "@/lib/routing/pretty-money-urls";
import {
  matchLegacySiloRedirect,
  matchSiloInternalRewrite,
  parentServiceSlug,
  siloAreaServicePath,
} from "@/lib/routing/location-silo";

/**
 * Clone the request URL for an *internal* rewrite.
 *
 * Behind nginx, `X-Forwarded-Proto: https` makes `request.nextUrl` report
 * https. Next then treats a rewrite whose origin does not match the bind
 * address as an external proxy to `https://localhost:<PORT>`, but the Node
 * process only speaks plain HTTP — rewritten money pages fail with EPROTO
 * "wrong version number". Force http so the hop stays on the loopback
 * listener even if origin matching misses.
 */
function internalUrl(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.protocol = "http:";
  return url;
}

/** Next.js 16+ network proxy (replaces deprecated middleware convention). */
export function proxy(request: NextRequest) {
  let { pathname } = request.nextUrl;

  if (pathname.length > 1 && pathname.endsWith(".xml/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  if (
    pathname !== pathname.toLowerCase() &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  pathname = pathname.toLowerCase();

  const sitemapFile = pathname.match(/^\/sitemaps\/([a-z0-9-]+)\.xml\/?$/);
  if (sitemapFile) {
    return NextResponse.rewrite(
      internalUrl(request, `/sitemaps/${sitemapFile[1]}/`),
    );
  }

  if (pathname === "/terms/" || pathname === "/terms") {
    const url = request.nextUrl.clone();
    url.pathname = "/terms-and-conditions/";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/service-areas/" || pathname === "/service-areas") {
    const url = request.nextUrl.clone();
    url.pathname = "/locations/andhra-pradesh/";
    return NextResponse.redirect(url, 308);
  }

  const siloRewrite = matchSiloInternalRewrite(pathname);
  if (siloRewrite && siloRewrite !== pathname) {
    return NextResponse.rewrite(internalUrl(request, siloRewrite));
  }

  const legacy = matchLegacySiloRedirect(pathname);
  if (legacy && legacy !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = legacy;
    return NextResponse.redirect(url, 308);
  }

  // Core /{service}-in-{city}/ and overlapping keyword×city intents → silo
  const cityPretty = matchServiceInCityPrettyPath(pathname);
  if (cityPretty && pathname !== cityPretty.canonicalPath) {
    const url = request.nextUrl.clone();
    url.pathname = cityPretty.canonicalPath;
    return NextResponse.redirect(url, 308);
  }

  // Remaining keyword × city / area / scale locality pretty URLs
  const keywordPretty = matchKeywordInGeoPrettyPath(pathname);
  if (keywordPretty) {
    return NextResponse.rewrite(internalUrl(request, keywordPretty.rewritePath));
  }

  const areaPretty = matchAreaMoneyPrettyPath(pathname);
  if (areaPretty) {
    const dest = siloAreaServicePath(
      areaPretty.citySlug,
      areaPretty.areaSlug,
      parentServiceSlug(areaPretty.serviceSlug) ?? areaPretty.serviceSlug,
    );
    const url = request.nextUrl.clone();
    url.pathname = dest;
    return NextResponse.redirect(url, 308);
  }

  const internalKeyword = pathname.match(
    /^\/landings\/keyword\/([a-z0-9-]+)\/in\/([a-z0-9-]+)\/?$/,
  );
  if (internalKeyword) {
    const pretty = `/${internalKeyword[1]}-in-${internalKeyword[2]}/`;
    const silo = matchServiceInCityPrettyPath(pretty)?.canonicalPath;
    if (silo) {
      const url = request.nextUrl.clone();
      url.pathname = silo;
      return NextResponse.redirect(url, 308);
    }
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
      const dest = siloAreaServicePath(
        internalArea[3],
        internalArea[4],
        parentServiceSlug(internalArea[1]) ?? internalArea[1],
      );
      const url = request.nextUrl.clone();
      url.pathname = dest;
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
