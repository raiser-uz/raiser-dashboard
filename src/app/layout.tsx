import { NavigationBlockerProvider } from "features/navigation-blocker"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../shared/styles/globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Raiser",
  description: "Dashboard for Raiser application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <NavigationBlockerProvider>{children}</NavigationBlockerProvider>
      </body>
    </html>
  )
}
