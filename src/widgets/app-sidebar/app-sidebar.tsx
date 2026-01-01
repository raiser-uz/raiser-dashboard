"use client"

import * as React from "react"

import { pages } from "app/router"
import { Home, Users } from "lucide-react"
import { warehouseApi } from "shared/api/init"
import { Icons, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "shared/ui"
import { NavMain } from "./ui/nav-main"
import { NavProjects } from "./ui/nav-projects"
import { NavUser } from "./ui/nav-user"
import { TeamSwitcher } from "./ui/team-switcher"

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "raiser@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Test Corp.",
      logo: Icons.Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: pages.index.href,
      icon: Home,
      isActive: true,
    },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: Icons.DeviceAnalytics,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "History",
    //       url: "#",
    //     },
    //     {
    //       title: "Starred",
    //       url: "#",
    //     },
    //     {
    //       title: "Settings",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Users",
      url: pages.users.href,
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: Icons.Lifebuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Icons.Send,
    },
  ],
  projects: [
    {
      name: "Sales & Marketing",
      url: "#",
      icon: Icons.ChartPie,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = warehouseApi.account.useGetCurrentUserImmutable()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: [user.data?.firstName, user.data?.lastName].filter(Boolean).join(" "),
            email: user.data?.email || "",
            avatar: "/",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
