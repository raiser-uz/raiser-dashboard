"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { useForm } from "react-hook-form"
import { Logo } from "shared/assets"
import { authZod } from "shared/lib"

import { pages } from "app/router"
import Link from "next/link"
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Label } from "shared/ui"
import { z } from "zod"

const formSchema = z.object({
  email: authZod.email,
  password: authZod.password,
})

export const LoginForm = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
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
            <h1 className="text-xl font-bold">Welcome to Raiser.</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href={pages.signUp.href} className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" placeholder="m@example.com" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" required />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
