import { pages, publicPages } from "app/router"
import { NextRequest, NextResponse } from "next/server"

import { routing } from "i18n/routing"
import createMiddleware from "next-intl/middleware"
import { getToken } from "shared/lib"

const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request)

  const sessionToken = await getToken()
  const locale = request.cookies.get("NEXT_LOCALE")?.value || routing.defaultLocale

  const currentPath = request.nextUrl.pathname.replace(`/${locale}`, "")

  if (!sessionToken && publicPages.includes(currentPath) === false) {
    const loginUrl = new URL(`/${locale}${pages.login.href}`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
