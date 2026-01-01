"use server"

import { cookies } from "next/headers"

export async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("sessionToken")?.value || null
}

export async function clearToken() {
  const cookieStore = await cookies()
  cookieStore.delete("sessionToken")
}

export async function setToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("sessionToken", token, { path: "/" })
}
