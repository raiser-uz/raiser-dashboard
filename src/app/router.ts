import { RouteType } from "next/dist/lib/load-custom-routes"

type hrefType = __next_route_internal_types__.RouteImpl<RouteType>

const page = (href: string): { href: hrefType; hrefAs: string } => ({ href: href as hrefType, hrefAs: href as string })

export const pages = {
  index: page("/"),
  login: page("/login"),
  signUp: page("/sign-up"),
  soon: page("/soon"),
  users: {
    ...page("/users"),
  },
}

export const protectedPages: string[] = [pages.index.href]

export const publicPages: string[] = [pages.login.href, pages.signUp.href, pages.soon.href]
