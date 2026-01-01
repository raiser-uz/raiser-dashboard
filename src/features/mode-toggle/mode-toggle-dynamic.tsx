"use client"

import dynamic from "next/dynamic"

const ModeToggle = dynamic(() => import("."), {
  ssr: false,
})

export const ModeToggleDynamic = ModeToggle
