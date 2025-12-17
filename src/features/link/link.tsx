"use client"

import { useNavigationBlocker } from "features/navigation-blocker"
import NextLink from "next/link"

interface CustomLinkProps extends React.ComponentProps<typeof NextLink> {
  children: React.ReactNode
}

export const Link = ({ children, ...props }: CustomLinkProps) => {
  const { isBlocked } = useNavigationBlocker()
  console.log("🚀 ~ Link ~ isBlocked:", isBlocked)

  return (
    <NextLink
      onNavigate={(e) => {
        if (isBlocked && !window.confirm("You have unsaved changes. Leave anyway?")) {
          e.preventDefault()
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  )
}
