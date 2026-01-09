"use server"

import { cookies } from "next/headers"

export async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value || null
}

export async function getRefreshToken() {
  const cookieStore = await cookies()
  return cookieStore.get("refreshToken")?.value || null
}

export async function getTokenExpiry() {
  const cookieStore = await cookies()
  const expiry = cookieStore.get("tokenExpiry")?.value
  return expiry ? parseInt(expiry, 10) : null
}

export async function clearToken() {
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
  cookieStore.delete("tokenExpiry")
}

export async function setToken(accessToken: string, refreshToken: string, expiresIn?: number) {
  const cookieStore = await cookies()

  // Calculate expiry timestamp if expiresIn is provided
  const expiryTimestamp = expiresIn ? Date.now() + expiresIn * 1000 : null

  cookieStore.set("accessToken", accessToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // maxAge: expiresIn || undefined
  })

  cookieStore.set("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })

  if (expiryTimestamp) {
    cookieStore.set("tokenExpiry", expiryTimestamp.toString(), {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
  }
}
