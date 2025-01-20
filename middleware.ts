// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;


//   const token = request.cookies.get("auth_token")?.value;

//   console.log(token)

//   if ((pathname === "/login" || pathname === "/register") && token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   if (!token && pathname !== "/login" && pathname !== "/register") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/master/:path*", "/login", "/"], 
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_VALIDATE_TOKEN_URL_API}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const result = await response.json()
      if (result.status == 200) {
        if (pathname === "/login" || pathname === "/register") {
          return NextResponse.redirect(new URL("/", request.url));
        }
        if (pathname === "/") {
          return NextResponse.redirect(new URL("/home", request.url));
        }

        return NextResponse.next(); 
      } else {
        const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
        redirectResponse.cookies.delete("auth_token");
        return redirectResponse;
      }
    } catch (error) {
      const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
      redirectResponse.cookies.delete("auth_token");
      return redirectResponse;
    }
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ["/master/:path*", "/login", "/", "/visit/:path*", "/home"], 
};
