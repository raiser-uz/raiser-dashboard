import { RouteType } from "next/dist/lib/load-custom-routes"
import { LinkProps } from "next/link"

const page = (href: LinkProps<RouteType>["href"]): { href: LinkProps<RouteType>["href"] } => ({ href })

export const pages = {
  index: page("/"),
  login: page("/login"),
  signUp: page("/sign-up"),
}
