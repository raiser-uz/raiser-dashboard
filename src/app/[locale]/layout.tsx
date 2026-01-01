import { NavigationBlockerProvider } from "features/navigation-blocker"
import { routing } from "i18n/routing"
import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import "shared/styles/globals.css"
import { Toaster } from "shared/ui"
import { SWRConfig } from "swr"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Raiser",
  description: "Dashboard for Raiser application",
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <SWRConfig>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NextIntlClientProvider>
              <NavigationBlockerProvider>
                <Toaster richColors />
                {children}
              </NavigationBlockerProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </SWRConfig>
      </body>
    </html>
  )
}
