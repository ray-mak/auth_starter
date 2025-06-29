import { NextResponse, type NextRequest } from "next/server"
import {
  getUserFromSession,
  updateUserSessionExpiration,
} from "./auth/core/session"

const privateRoutes = ["/private"]
const adminRoutes = ["/admin"]

export default async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next()

  await updateUserSessionExpiration({
    set: (key, value, options) => {
      response.cookies.set({ ...options, name: key, value })
    },
    get: (key) => request.cookies.get(key),
  })

  return response
}

async function middlewareAuth(request: NextRequest) {
  if (privateRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession(request.cookies)
    if (user == null) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (adminRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession(request.cookies)
    if (user == null) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }
}

//skip nextjs related pages (only run middleware on pages we care about)
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
