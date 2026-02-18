"use client"

import dynamic from "next/dynamic"

const DashboardHeader = dynamic(
  () => import("@/components/dashboard-header").then((mod) => mod.DashboardHeader),
  { ssr: false }
)

export function DashboardHeaderWrapper() {
  return <DashboardHeader />
}
