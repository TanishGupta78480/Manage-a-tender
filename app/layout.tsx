import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import dynamic from "next/dynamic"
import "./globals.css"

const DashboardHeader = dynamic(
  () => import("@/components/dashboard-header").then((mod) => mod.DashboardHeader),
  { ssr: false }
)

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Private Label Sourcing Tool",
  description: "Procurement and sourcing management for private label products",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <DashboardHeader />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
