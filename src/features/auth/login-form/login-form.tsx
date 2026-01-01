"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { useForm } from "react-hook-form"
import { Logo } from "shared/assets"

import { pages } from "app/router"
import { useRouter } from "i18n/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { warehouseApi } from "shared/api/init"
import { setToken } from "shared/lib"
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "shared/ui"
import { toast } from "sonner"
import { z } from "zod"

export const LoginForm = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  const t = useTranslations("features.auth.login-form")
  const router = useRouter()
  const searchParams = useSearchParams()

  const formSchema = z.object({
    username: z.string().min(1, t("username.required")),
    password: z
      .string()
      .min(1, t("password.required"))
      .refine((value) => value === "password" || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value), {
        message: t("password.pattern"),
      }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await warehouseApi.authentication
      .login({
        username: values.username,
        password: values.password,
      })
      .then(async (response) => {
        if (!response.accessToken) throw new Error(t("error.description"))

        await setToken(response.accessToken)
        toast.success(t("success.title"))

        const redirectTo = searchParams.get("from") || pages.index.href

        router.replace(redirectTo)
      })
      .catch((error) => {
        toast.error(t("error.title"), {
          description: error.response?.data?.message || t("error.description"),
        })
      })
  }

  return (
    <div className={clsx("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link href={pages.index.href} className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-auto items-center justify-center rounded-md">
                <Logo className="h-8 w-auto" />
              </div>
            </Link>
            <h1 className="text-xl font-bold">{t("title")}</h1>
            <div className="text-center text-sm">
              {t.rich("subtitle", {
                link: (children) => (
                  <Link href={pages.signUp.href} className="underline underline-offset-4">
                    {children}
                  </Link>
                ),
              })}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">{t("username.label")}</FormLabel>
                    <FormControl>
                      <Input id="username" placeholder={t("username.placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">{t("password.label")}</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" placeholder={t("password.placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {t("submit.label")}
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        {t.rich("terms", {
          terms: (children) => (
            <Link href="#" className="underline underline-offset-4">
              {children}
            </Link>
          ),
          privacy: (children) => (
            <Link href="#" className="underline underline-offset-4">
              {children}
            </Link>
          ),
        })}
      </div>
    </div>
  )
}
