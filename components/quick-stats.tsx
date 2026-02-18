"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, FileSearch, FileCheck, PiggyBank, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  getOpenTenders,
  getPendingSignOffTenders,
  getTotalSavingsThisYear,
  getTotalSourcingOpportunities,
} from "@/lib/data"

export function QuickStats() {
  const sourcingOpportunities = getTotalSourcingOpportunities()
  const openTenders = getOpenTenders()
  const pendingSignOff = getPendingSignOffTenders()
  const totalSavings = getTotalSavingsThisYear()

  const stats = [
    {
      label: "Sourcing Opportunities",
      value: sourcingOpportunities.toString(),
      subtitle: "Across all categories",
      icon: Lightbulb,
      href: "/opportunities",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Open Tenders",
      value: openTenders.length.toString(),
      subtitle: "Awaiting responses",
      icon: FileSearch,
      href: "/analyse",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending Sign-off",
      value: pendingSignOff.length.toString(),
      subtitle: "Ready for approval",
      icon: FileCheck,
      href: "/finalise",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Total Savings YTD",
      value: `£${(totalSavings / 1000).toFixed(1)}k`,
      subtitle: "From completed tenders",
      icon: PiggyBank,
      href: "/finalise",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href}>
          <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold text-card-foreground mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              <span>View details</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
