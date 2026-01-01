import { pages } from "app/router"
import { LocaleSwitcher } from "features/locale-switcher"
import { ModeToggleDynamic } from "features/mode-toggle"
import { redirect } from "next/navigation"
import { getToken } from "shared/lib"

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getToken()

  if (token) {
    redirect(pages.index.href)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full p-4 flex items-center justify-end gap-4 absolute top-0">
        <ModeToggleDynamic />
        <LocaleSwitcher />
      </div>
      {children}
    </div>
  )
}

export default AuthLayout
