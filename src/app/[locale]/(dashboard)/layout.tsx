import { pages } from "app/router"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "shared/ui"
import { AppSidebar } from "widgets/app-sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}
const DashboardLayout = (props: DashboardLayoutProps) => {
  if (process.env.IS_SOON === "true") {
    redirect(pages.soon.href)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 ">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
