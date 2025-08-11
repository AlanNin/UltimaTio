import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// protected routes no user
const NOT_ALLOWED_NO_USER = ["/settings"];

// protected routes user general
const NOT_ALLOWED_USER = ["/signin", "/signup"];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // extract tokens
  const access_token = request.cookies.get("access_token");

  // authentication state
  let isAuthenticated = !!access_token;

  // check if the current route matches restricted ones
  const isRestricted = (route: string) => {
    const url = new URL(request.url);
    const basePath = pathname;

    if (route.includes("*")) {
      const baseRoute = route.replace("/*", "");
      return basePath === baseRoute || basePath.startsWith(`${baseRoute}/`);
    }

    if (route.includes("?")) {
      const [pathPart, queryPart] = route.split("?");
      return basePath === pathPart && url.search === "?" + queryPart;
    }

    const regex = new RegExp(`^${route.replace("[id]", "\\d+")}$`);
    return regex.test(basePath);
  };

  // no user trying to access protected route not allowed
  if (!isAuthenticated && NOT_ALLOWED_NO_USER.some(isRestricted)) {
    return NextResponse.redirect(
      new URL(`/signin?redirect_fallback=${pathname}`, request.url)
    );
  }

  // patient trying to access protected route not allowed
  if (isAuthenticated && NOT_ALLOWED_USER.some(isRestricted)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
