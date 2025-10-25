import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const authenticationUrl = [
  "/login",
  "/signup",
  "/recoverPassword",
  "/setPassword",
  "/activateAccount",
];

const protectedRoutes = [];

export default async function middleware(req) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  const { pathname } = req.nextUrl;

  if (pathname.endsWith("/edit") && pathname.startsWith("/user")) {
    // If the user is not authenticated and trying to access the edit page
    if (!token) {
      const username = req.nextUrl.pathname.split("/")[2];
      return NextResponse.redirect(
        new URL(`${username ? `/user/${username}` : "/"}`, req.url)
      );
    } else {
      if (pathname !== `/user/${token.username}/edit`)
        return NextResponse.redirect(
          new URL(`/user/${token.username}/edit`, req.url)
        );
    }
  }

  // IF the user is authenticated and trying to access the login page, redirect to home page
  if (
    isAuthenticated &&
    authenticationUrl.some((url) => pathname.startsWith(url))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is not authenticated and trying to access a protected route, redirect to login page
  if (
    !isAuthenticated &&
    protectedRoutes.some((url) => pathname.startsWith(url))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:ico|png|jpg|jpeg|svg|json|txt|otf|ttf)).*)",
  ],
};
