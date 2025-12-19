"use client"

import { useNavigationBlocker } from "features/navigation-blocker"
import { Link as IntlLink } from "i18n/navigation"

interface CustomLinkProps extends React.ComponentProps<typeof IntlLink> {
  children: React.ReactNode
}

export const Link = ({ children, ...props }: CustomLinkProps) => {
  const { isBlocked } = useNavigationBlocker()

  return (
    <IntlLink
      onNavigate={(e) => {
        if (isBlocked && !window.confirm("You have unsaved changes. Leave anyway?")) {
          e.preventDefault()
        }
      }}
      {...props}
    >
      {children}
    </IntlLink>
  )
}
