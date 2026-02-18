"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Lightbulb,
  FileSearch,
  FileCheck,
  TrendingUp,
  Scale,
  BarChart3,
  Calendar,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import {
  getOpenTenders,
  getPendingSignOffTenders,
  getInputPriceOpportunities,
  getSpecOpportunities,
  getPriceMarginOpportunities,
  getContractRenewalOpportunities,
} from "@/lib/data"

export function MyPortfolio() {
  const openTenders = getOpenTenders()
  const pendingSignOff = getPendingSignOffTenders()
  const inputOpps = getInputPriceOpportunities()
  const specOpps = getSpecOpportunities()
  const priceMarginOpps = getPriceMarginOpportunities()
  const contractRenewalOpps = getContractRenewalOpportunities()

  const totalOpportunities = inputOpps.length + specOpps.length + priceMarginOpps.length + contractRenewalOpps.length

  const opportunityBreakdown = [
    {
      label: "Input Price Changes",
      count: inputOpps.length,
      tab: "input-price",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Spec Opportunities",
      count: specOpps.length,
      tab: "spec",
      icon: Scale,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Commercial Performance",
      count: priceMarginOpps.length,
      tab: "price-margin",
      icon: BarChart3,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Contract Renewals",
      count: contractRenewalOpps.length,
      tab: "contract-renewals",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ]

  return (
    <div className="mb-8 bg-muted/30 rounded-xl p-6 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Portfolio</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Workflow Progress</span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <ArrowRight className="h-3 w-3" />
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <ArrowRight className="h-3 w-3" />
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Opportunities Card */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent hover:border-amber-300 transition-colors h-full flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Opportunities</CardTitle>
                  <p className="text-xs text-muted-foreground">Identify & prioritise</p>
                </div>
              </div>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-lg font-bold px-3">
                {totalOpportunities}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 flex flex-col flex-1">
            <div className="space-y-1.5 flex-1">
              {opportunityBreakdown.map((item) => (
                <Link
                  key={item.tab}
                  href={`/opportunities?tab=${item.tab}`}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-amber-100/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-6 w-6 rounded ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                    </div>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-foreground">{item.count}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/opportunities"
              className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-amber-200 text-sm text-amber-700 hover:text-amber-800 transition-colors"
            >
              <span>View all opportunities</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Active Tenders Card */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent hover:border-blue-300 transition-colors h-full flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileSearch className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Active Tenders</CardTitle>
                  <p className="text-xs text-muted-foreground">Awaiting responses</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-lg font-bold px-3">
                {openTenders.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 flex flex-col flex-1">
            <div className="flex-1">
              {openTenders.length > 0 ? (
                <div className="space-y-1.5">
                  {openTenders.slice(0, 4).map((tender) => (
                    <Link
                      key={tender.id}
                      href={`/analyse?tender=${tender.id}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-blue-100/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{tender.name}</p>
                        <p className="text-xs text-muted-foreground">{tender.skuIds.length} SKUs</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  {openTenders.length > 4 && (
                    <p className="text-xs text-muted-foreground text-center py-1">
                      +{openTenders.length - 4} more tenders
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground">No active tenders</p>
                  <Link href="/tender" className="text-xs text-blue-600 hover:text-blue-700">
                    Launch a new tender
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/analyse"
              className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-blue-200 text-sm text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span>Analyse offers</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Pending Sign-off Card */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-transparent hover:border-green-300 transition-colors h-full flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Pending Sign-off</CardTitle>
                  <p className="text-xs text-muted-foreground">Ready for approval</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-lg font-bold px-3">
                {pendingSignOff.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 flex flex-col flex-1">
            <div className="flex-1">
              {pendingSignOff.length > 0 ? (
                <div className="space-y-1.5">
                  {pendingSignOff.slice(0, 4).map((tender) => (
                    <Link
                      key={tender.id}
                      href={`/finalise?tender=${tender.id}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-green-100/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{tender.name}</p>
                        <p className="text-xs text-muted-foreground">
                          £{(tender.estimatedValue / 1000).toFixed(1)}k value
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  {pendingSignOff.length > 4 && (
                    <p className="text-xs text-muted-foreground text-center py-1">
                      +{pendingSignOff.length - 4} more pending
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground">No tenders pending</p>
                  <p className="text-xs text-muted-foreground">Complete offer analysis first</p>
                </div>
              )}
            </div>
            <Link
              href="/finalise"
              className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-green-200 text-sm text-green-700 hover:text-green-800 transition-colors"
            >
              <span>View agreements</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
