import { pages } from "app/router"
import { redirect } from "next/navigation"
import { Logo } from "shared/assets"

const SoonPage = () => {
  if (!process.env.IS_SOON) {
    redirect(pages.index.href)
  }

  return (
    <div className="flex flex-col items-center w-screen h-screen justify-center text-4xl font-bold gap-4">
      <Logo className="h-12 ml-2" />
      Coming soon . . .
    </div>
  )
}

export default SoonPage
