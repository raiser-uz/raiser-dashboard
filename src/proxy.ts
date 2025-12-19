import { pages, publicPages } from "app/router"
import { NextRequest, NextResponse } from "next/server"

import { routing } from "i18n/routing"
import createMiddleware from "next-intl/middleware"

const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request)

  const sessionToken = request.cookies.get("sessionToken")?.value
  const locale = request.cookies.get("NEXT_LOCALE")?.value

  if (!sessionToken && publicPages.includes(request.nextUrl.pathname.replace(`/${locale}`, "")) === false) {
    const loginUrl = new URL(`/${locale}${pages.login.href}`, request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
